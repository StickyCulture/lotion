import path from 'path'

import logger from './utils/logger'
import { getAllNotionData } from './utils/notion'
import { saveFileLocally } from './utils/file'

import { useJsonTemplate } from './template/json'
import { useJavascriptTemplate } from './template/javascript'
import { useTypescriptTemplate } from './template/typescript'

import {
   LotionFieldType,
   LotionInput,
   LotionConfig,
   SchemaFile,
   FilteredRow,
   LotionOutputPaths,
   LotionParams,
} from './types'
import { sanitizeText } from './utils/text'

const UNKNOWN_DEFAULTS: { [key in LotionFieldType]: any } = {
   uuid: '',
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
}

class Lotion {
   private config: LotionConfig
   private outputPath: LotionOutputPaths

   private progress: string = ''

   constructor({ config, outputPath }: LotionParams) {
      this.config = config
      this.outputPath = outputPath
   }

   public run = async () => {
      // get all data from notion
      logger.info('Gathering data from Notion...')
      const notionData = await getAllNotionData(this.config.database, process.env.NOTION_TOKEN)

      // get the field that is the page title
      const pageTitleField = (this.config.input.find(input => input.type === 'title') || { field: 'id' }).field
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

         const pageTitle =
            pageTitleField === 'id'
               ? row.id
               : row.properties[pageTitleField][row.properties[pageTitleField].type].length
               ? row.properties[pageTitleField][row.properties[pageTitleField].type][0].plain_text
               : row.id
         logger.quiet(`${this.progress} Processing item for ${pageTitle}`)
         logger.indent = this.progress.length + 1

         // filter the raw data
         const filteredRow: FilteredRow = this.filterRow(row)

         // skip if invalid
         const isValid = await this.validateRow(filteredRow)
         if (!isValid) {
            numInvalid++
            continue
         }

         // perform transformations
         const transformedRow: FilteredRow = await this.transformRow(filteredRow)

         // reshape the transformed input to match the schema
         const reshapedRow: any = this.reshapeObject(transformedRow, this.config.schema)

         // add the reshaped input to the formatted data
         formattedData.push(reshapedRow)
      }
      logger.indent = 0

      // post process the data
      if (this.config.postProcess) {
         logger.info('Running post-processing action on data...')
         formattedData = await this.config.postProcess(formattedData)
      }

      // write the formatted data to the output files
      await this.createOutputFiles(formattedData)

      logger.break()
      logger.success(`Processed ${formattedData.length} items.`)
      if (numInvalid > 0) {
         logger.warn(`${numInvalid} items were invalid and skipped. See above for details.`)
      }
   }

   private filterRow = (item: any): FilteredRow => {
      const result: FilteredRow = {}
      this.config.input.forEach((input: LotionInput) => {
         logger.verbose(`Getting raw input for ${input.field}`)

         if (input.field === 'id' && input.type === 'uuid') {
            result[input.field] = item.id
            return
         }

         const defaultValue = input.default || UNKNOWN_DEFAULTS[input.type]

         // if the field is not a property of item.properties object, return the default value
         if (!item.properties[input.field]) {
            result[input.field] = defaultValue
            return
         }

         // if the field is a property of item.properties object, return its raw or default value
         const property = item.properties[input.field]
         const rawValue = property[property.type]

         logger.verbose(rawValue)
         switch (input.type) {
            case 'text':
               // convert the original array to a plaintext string
               result[input.field] = rawValue.length
                  ? rawValue.map((value: any) => value.plain_text).join('')
                  : defaultValue
               return
            case 'richText':
               // this is a special case because the raw value is an array of objects
               result[input.field] = rawValue.length
                  ? rawValue.map((value: any) => ({
                       text: value.plain_text,
                       href: value.href,
                       annotations: value.annotations,
                    }))
                  : defaultValue
               return
            case 'file':
            case 'image':
               // only one value is expected for these types
               result[input.field] = rawValue.length > 0 ? rawValue[0].file.url : defaultValue
               return
            case 'option':
               // only one value is expected for this types
               if (property.type === 'multi_select') {
                  result[input.field] = rawValue.length > 0 ? rawValue[0] : defaultValue
               } else if (property.type === 'select') {
                  result[input.field] = rawValue ? rawValue.name : defaultValue
               } else {
                  result[input.field] = defaultValue
               }
               return
            case 'files':
            case 'images':
               // multiple values are allowed for these types
               result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.file.url) : defaultValue
               return
            case 'options':
               // multiple values are allowed for these types
               if (property.type === 'multi_select') {
                  result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.name) : defaultValue
               } else if (property.type === 'select') {
                  result[input.field] = rawValue ? [rawValue.name] : defaultValue
               } else {
                  result[input.field] = defaultValue
               }
               return
            case 'relation':
               // one one value is expected for this type
               result[input.field] = rawValue.length > 0 ? rawValue[0].id : defaultValue
               return
            case 'relations':
               // multiple values are allowed for this type
               result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.id) : defaultValue
               return
            default:
               result[input.field] = rawValue
               return
         }
      })
      return result
   }

   private validateRow = async (row: FilteredRow): Promise<boolean> => {
      let isValid = true
      for (const { validate, field } of this.config.input) {
         if (!validate) continue

         const value = row[field]
         logger.verbose(`Validating (${value}) for ${field}`)
         const result = await validate(value, row)
         if (!result) {
            isValid = false
            logger.warn(`Input for '${field}' is invalid.`)
         }
      }
      return isValid
   }

   private transformRow = async (row: FilteredRow): Promise<FilteredRow> => {
      const transformed: FilteredRow = {}
      for await (const definition of this.config.input) {
         // save local files before transforming
         switch (definition.type) {
            case 'file':
            case 'image':
               let fileData: SchemaFile = await saveFileLocally(
                  row[definition.field],
                  this.outputPath.content.absolute,
                  [row.id, sanitizeText(definition.field), 0].join('_')
               )
               fileData.path = this.outputPath.content.relative || fileData.path
               row[definition.field] = fileData
               break
            case 'files':
            case 'images':
               row[definition.field] = await Promise.all(
                  row[definition.field].map(async (remoteUrl: string, index: number) => {
                     let fileData: SchemaFile = await saveFileLocally(
                        remoteUrl,
                        this.outputPath.content.absolute,
                        [row.id, sanitizeText(definition.field), index].join('_')
                     )
                     fileData.path = this.outputPath.content.relative || fileData.path
                     return fileData
                  })
               )
               break
            default:
               break
         }

         // transform the input
         if (definition.transform) {
            logger.verbose(`Transforming ${definition.type} for ${definition.field}`)
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
      for await (const file of this.config.outputFiles) {
         const filePath = path.join(this.outputPath.data.absolute, file)
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
}

export default Lotion
