import fs from 'fs'
import path from 'path'

import logger from './utils/logger'
import {
   createPage,
   formatExportData,
   getAllNotionData,
   getAllPageBlocks,
   getDatabase,
   getPage,
   updatePageProperties,
} from './utils/notion'
import { createSchemaFile } from './utils/file'

import { useJsonTemplate } from './template/json'
import { useJavascriptTemplate } from './template/javascript'
import { useTypescriptTemplate } from './template/typescript'

import {
   LotionFieldType,
   SchemaFile,
   FilteredRow,
   LotionFieldExport,
   SchemaIndex,
   LotionConstructor,
   SchemaRichText,
} from './types'
import { convertToPlaintext, convertToRichText, sanitizeText } from './utils/text'
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const UNKNOWN_DEFAULTS: { [key in LotionFieldType]: any } = {
   uuid: '',
   index: { number: 0, prefix: '', value: '' },
   title: '',
   text: '',
   richText: [],
   number: 0,
   boolean: false,
   files: [],
   file: '',
   images: [],
   image: '',
   options: [],
   option: '',
   relation: '',
   relations: [],
   blocks: [],
}
/**
 * Lotion is a class that allows you to import data from Notion into a JSON, JS, or TS file or as a JavaScript object in memory.
 *
 * Lotion automatically simplifies the data from Notion into a format that is easier to work with and allows you to apply additional transformations and validations before it is output. You define the schema you want for your data and Lotion will reshape the data to match that schema.
 *
 * Lotion also allows you to export the data to another Notion database after transformations and validations.
 *
 * @example
 * const lotion = new Lotion({
 *    contentDir: '/path/to/content',
 *    outputFiles: ['data.json'],
 *    import: {
 *       database: '12345678-1234-1234-1234-1234567890ab',
 *       token: 'secret_123
 *       fields: [
 *          { field: 'id', type: 'uuid' },
 *          { field: 'Custom ID', type: 'index', transform: value => value.value },
 *          { field: 'Item Name', type: 'title' },
 *          { field: 'Description', type: 'richText' },
 *          { field: 'Subtitle', type: 'text' },
 *          { field: 'Files', type: 'files' },
 *          { field: 'Images', type: 'images' },
 *          { field: 'Category', type: 'option' },
 *          { field: 'Quantity', type: 'number' },
 *          { field: 'Tags', type: 'options', transform: arr => arr.map(item => item.toLowerCase())},
 *          { field: 'Is Published', type: 'boolean', validate: value => value },
 *          { field: 'Related', type: 'relation' },
 *       ],
 *       schema: {
 *          id: 'id',
 *          title: 'Item Name',
 *          subtitle: 'Subtitle',
 *          description: 'Description',
 *          media: {
 *             files: 'Files',
 *             images: 'Images',
 *          },
 *          category: 'Category',
 *          quantity: 'Quantity',
 *          tags: 'Tags',
 *          related: 'Related',
 *          notionPageId: 'id',
 *          notionLookupId: 'Custom ID',
 *       },
 *    },
 * })
 * const data = await lotion.run()
 */
class Lotion {
   private config: LotionConstructor

   private progress: string = ''
   private currentTitle: string = ''

   private get isMemoryOnly(): boolean {
      return this.config.outputFiles.length === 1 && this.config.outputFiles[0] === 'memory'
   }

   constructor(params: LotionConstructor) {
      // make sure outputFiles exist
      if (!params.outputFiles || !params.outputFiles.length) {
         throw new Error('No output specified. Aborting.')
      }

      // make sure outputFiles are of type json, js, or ts
      if (
         !params.outputFiles.every(
            (file: string) => file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts') || 'memory'
         )
      ) {
         throw new Error('Output files must be "memory" or have extension ".json", ".js", or ".ts". Aborting.')
      }

      // set absolute path for all output files and content
      params.basePath = params.basePath || process.cwd()
      params.contentDir = path.join(params.basePath, params.contentDir || 'content')
      params.outputFiles = params.outputFiles.map(file => {
         if (file === 'memory') {
            return file
         }
         return path.join(params.basePath, file)
      })

      if (!params.import.token) {
         throw new Error('Notion import token is required. Aborting.')
      }

      if (params.export) {
         if (params.export.database === params.import.database) {
            params.export.token = params.export.token || params.import.token
         } else if (!params.export.token) {
            throw new Error('Notion export token is required. Aborting.')
         }
      }

      this.config = params
   }

   /**
    * Run the Lotion instance
    */
   public run = async () => {
      // test all fields
      if (this.config.export) {
         await this.testFields(this.config.export)
      }

      // get all data from notion
      logger.info('Gathering data from Notion...')
      const notionData = await getAllNotionData(this.config.import.database, this.config.import.token, {
         filter: this.config.import.filters,
         sorts: this.config.import.sorts,
         limit: this.config.import.limit,
         offset: this.config.import.offset,
      })

      // get the field that is the page title
      const pageTitleField = (this.config.import.fields.find(input => input.type === 'title') || { field: 'id' }).field
      logger.verbose(`Using "${pageTitleField}" as page title field`)

      let formattedData = []
      let numInvalid = 0
      let index = 0

      for await (const row of notionData as any) {
         index++
         logger.indent = 0

         this.progress = logger.getProgress(index, notionData.length)
         if (!row.properties) {
            logger.quiet(`${this.progress} Item ${row.id} has no properties. Skipping.`)
            continue
         }

         this.currentTitle =
            pageTitleField === 'id'
               ? row.id
               : row.properties[pageTitleField][row.properties[pageTitleField].type].length
               ? row.properties[pageTitleField][row.properties[pageTitleField].type][0].plain_text
               : row.id
         logger.quiet(`${this.progress} Processing item for ${this.currentTitle}`)
         logger.indent = this.progress.length + 1

         // filter the raw data
         const filteredRow: FilteredRow = await this.filterRow(row)

         // skip if invalid
         const isValid = await this.validateRow(filteredRow)
         if (!isValid) {
            numInvalid++
            continue
         }

         // perform transformations
         const transformedRow: FilteredRow = await this.transformRow(filteredRow)

         // reshape the transformed input to match the schema
         const reshapedRow: any = this.reshapeObject(transformedRow, this.config.import.schema)

         // add the reshaped input to the formatted data
         formattedData.push(reshapedRow)
      }
      logger.indent = 0

      const totalProcessed = formattedData.length
      // post process the data
      if (this.config.import.postProcess) {
         logger.info('Running post-processing action on data...')
         formattedData = await this.config.import.postProcess(formattedData)
      }

      // write the formatted data to the output files
      await this.createOutputFiles(formattedData)

      logger.break()
      logger.success(`Imported ${totalProcessed} items.`)
      if (numInvalid > 0) {
         logger.warn(`${numInvalid} items were invalid and skipped. See above for details.`)
      }

      if (this.config.export) {
         await this.exportData(formattedData)
      }

      return formattedData
   }

   public cancel = () => {
      logger.warn('\nOperation cancelled.\n')
      process.exit(1)
   }

   private testFields = async (scope: LotionConstructor['import'] | LotionConstructor['export']) => {
      const response = await getDatabase(scope.database, scope.token)

      const incorrectFields: string[] = []
      scope.fields.forEach(expectedProperty => {
         const name = expectedProperty.field
         if (name === 'id') {
            return
         }
         const property = response.properties[name]
         if (!property) {
            incorrectFields.push(expectedProperty.field)
         }
      })

      if (incorrectFields.length) {
         logger.error(
            `\nThe following fields are not present in the Notion database:\n  - ${incorrectFields.join('\n  - ')}`
         )
         this.cancel()
      }
   }

   private filterRow = async (item: any): Promise<FilteredRow> => {
      const result: FilteredRow = {}
      for await (const input of this.config.import.fields) {
         logger.verbose(`Getting raw input for ${input.field}`)

         if (input.field === 'id' && input.type === 'uuid') {
            result[input.field] = item.id
            continue
         }

         if (input.type === 'blocks') {
            const blocks = await getAllPageBlocks(item.id, this.config.import.token)
            const blockRichText: SchemaRichText[][] = []
            blocks.forEach((block: BlockObjectResponse) => {
               if (!block.type) {
                  logger.warn(`Block ${block.id} has no type and may be a partial block response. Skipping.`)
                  return
               }
               if (block.has_children) {
                  logger.warn(`Block ${block.id} has children. This isn't yet supported. Skipping.`)
                  return
               }
               const data: any = (block as any)[block.type]
               if (data && data.rich_text) {
                  blockRichText.push(convertToRichText(data.rich_text))
               } else {
                  logger.warn(`Block ${block.id} has no rich text. Skipping.`)
               }
            })
            result[input.field] = blockRichText
            logger.verbose(result[input.field])
            continue
         }

         const defaultValue = input.default || UNKNOWN_DEFAULTS[input.type]

         // if the field is not a property of item.properties object, return the default value
         if (!item.properties[input.field]) {
            logger.warn(`Field ${input.field} not found in item. Using default value.`)
            result[input.field] = defaultValue
            continue
         }

         // if the field is a property of item.properties object, return its raw or default value
         const property = item.properties[input.field]
         const rawValue = property[property.type]

         logger.verbose(rawValue)
         switch (input.type) {
            case 'index': {
               const { prefix, number } = rawValue
               result[input.field] = {
                  number,
                  prefix,
                  value: `${prefix}${prefix ? '-' : ''}${number}`,
               } as SchemaIndex
               return
            }
            case 'title':
            case 'text':
               // convert the original array to a plaintext string
               result[input.field] = rawValue.length ? convertToPlaintext(rawValue) : defaultValue
               break
            case 'richText':
               // this is a special case because the raw value is an array of objects
               result[input.field] = rawValue.length ? convertToRichText(rawValue) : defaultValue
               break
            case 'file':
            case 'image':
               // only one value is expected for these types
               result[input.field] = rawValue.length > 0 ? rawValue[0].file.url : defaultValue
               break
            case 'option':
               // only one value is expected for this types
               if (property.type === 'multi_select') {
                  result[input.field] = rawValue.length > 0 ? rawValue[0] : defaultValue
               } else if (property.type === 'select') {
                  result[input.field] = rawValue ? rawValue.name : defaultValue
               } else {
                  result[input.field] = defaultValue
               }
               break
            case 'files':
            case 'images':
               // multiple values are allowed for these types
               result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.file.url) : defaultValue
               break
            case 'options':
               // multiple values are allowed for these types
               if (property.type === 'multi_select') {
                  result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.name) : defaultValue
               } else if (property.type === 'select') {
                  result[input.field] = rawValue ? [rawValue.name] : defaultValue
               } else {
                  result[input.field] = defaultValue
               }
               break
            case 'relation':
               // one one value is expected for this type
               result[input.field] = rawValue.length > 0 ? rawValue[0].id : defaultValue
               break
            case 'relations':
               // multiple values are allowed for this type
               result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.id) : defaultValue
               break
            default:
               result[input.field] = rawValue
               break
         }
      }
      return result
   }

   private validateRow = async (row: FilteredRow): Promise<boolean> => {
      let isValid = true
      for (const { validate, field } of this.config.import.fields) {
         if (!validate) continue

         const value = row[field]
         logger.verbose(`Validating (${value}) for ${field} (${this.currentTitle})`)
         const result = await validate(value, row)
         if (!result) {
            isValid = false
            logger.warn(`Validation check for '${field}' failed (${this.currentTitle})`)
         }
      }
      return isValid
   }

   private transformRow = async (row: FilteredRow): Promise<FilteredRow> => {
      const transformed: FilteredRow = {}
      for await (const definition of this.config.import.fields) {
         // save local files before transforming
         switch (definition.type) {
            case 'file':
            case 'image': {
               const remoteUrl = row[definition.field]
               let fileData: SchemaFile = await createSchemaFile(
                  remoteUrl,
                  this.config.contentDir,
                  [row.id, sanitizeText(definition.field), 0].join('_'),
                  !this.isMemoryOnly
               )
               row[definition.field] = fileData
               break
            }
            case 'files':
            case 'images': {
               row[definition.field] = await Promise.all(
                  row[definition.field].map(async (remoteUrl: string, index: number) => {
                     let fileData: SchemaFile = await createSchemaFile(
                        remoteUrl,
                        this.config.contentDir,
                        [row.id, sanitizeText(definition.field), index].join('_'),
                        !this.isMemoryOnly
                     )
                     return fileData
                  })
               )
               break
            }
            default:
               break
         }

         // transform the input
         if (definition.transform) {
            logger.verbose(`Transforming ${definition.type} for ${definition.field} (${this.currentTitle})`)
            transformed[definition.field] = await definition.transform(row[definition.field], row)
         } else {
            transformed[definition.field] = row[definition.field]
         }
      }
      return transformed
   }

   private reshapeObject = (input: any, schema: any): any => {
      const reshaped: any = {}

      // assumes we have descended into an array of strings
      if (typeof schema === 'string') {
         return input[schema]
      }

      // assumes we have descended into an array
      if (Array.isArray(schema)) {
         return schema.map((item: any) => this.reshapeObject(input, item))
      }

      // assumes we have descended into an object
      // reshape the keys
      Object.keys(schema).forEach(key => {
         const value = schema[key]
         reshaped[key] = this.reshapeObject(input, value)
      })

      return reshaped
   }

   private createOutputFiles = async (formattedData: any) => {
      if (this.isMemoryOnly) {
         logger.info('Memory only output. Skipping file creation.')
         return
      }

      for await (const filePath of this.config.outputFiles) {
         if (filePath === 'memory') {
            continue
         }

         const fileDir = path.dirname(filePath)
         if (!fs.existsSync(fileDir)) {
            logger.info(`Creating directory ${fileDir}`)
            fs.mkdirSync(fileDir, { recursive: true })
         }
         logger.info(`Writing data to ${filePath}`)
         // get the file extension
         const fileExtension = path.extname(filePath)
         // write the file
         switch (fileExtension) {
            case '.json':
               useJsonTemplate(formattedData, filePath)
               break
            case '.js':
               useJavascriptTemplate(formattedData, filePath)
               break
            case '.ts':
               useTypescriptTemplate(formattedData, filePath, this.config)
               break
            default:
               logger.error(`Unsupported file extension ${fileExtension}. Did not write create file.`)
               return
         }
      }
   }

   private exportData = async (formattedData: any) => {
      const notionData = []
      for (const row of formattedData) {
         const remappedRow: any = { properties: {} }
         this.config.export.fields.forEach(({ field, input, type }: LotionFieldExport) => {
            const value = row[input]
            if (type === 'uuid') {
               remappedRow.id = value
               return
            }
            const reformattedData = formatExportData(value, type)
            if (reformattedData === undefined) {
               logger.verbose(`Field ${field} of type ${type} is not supported for export. Skipping.`)
               return
            }
            remappedRow.properties[field] = reformattedData
         })
         notionData.push(remappedRow)
      }
      logger.verbose('Remapped data for export:')
      logger.verbose(notionData)

      let updateIndex = 0
      for await (const row of notionData) {
         updateIndex++
         this.progress = logger.getProgress(updateIndex, notionData.length)
         this.currentTitle = row.id
         logger.quiet(`${this.progress} Exporting item for ${this.currentTitle}`)

         if (!row.id) {
            await createPage(this.config.export.token, this.config.export.database, row.properties)
            continue
         } else {
            const existingPage = await getPage(this.config.export.token, row.id)
            if (!existingPage) {
               await createPage(this.config.export.token, this.config.export.database, row.properties)
               continue
            }
         }

         await updatePageProperties(this.config.export.token, row.id, row.properties)
      }
   }
}

export default Lotion
