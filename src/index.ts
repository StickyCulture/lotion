import fs from 'fs'
import path from 'path'

import { configDotenv } from 'dotenv'
import { cosmiconfig, CosmiconfigResult } from 'cosmiconfig'

import Logger from './utils/logger'
import { getAllNotionData } from './utils/notion'
import { saveFileLocally } from './utils/file'

import { useJsonTemplate } from './template/json'
import { useJavascriptTemplate } from './template/javascript'
import { useTypescriptTemplate } from './template/typescript'

import { LotionFieldType, LotionInput, LotionConfig, SchemaFile, LoggerLogLevel, FilteredRow } from './types'
import { sanitizeText } from './utils/text'

const logger = new Logger()
const explorer = cosmiconfig('lotion')

let CONFIG_PATH_ABSOLUTE = ''
let CONTENT_PATH_ABSOLUTE = ''
let CONTENT_PATH_RELATIVE = ''
let CONFIG: LotionConfig

let progress = ''

const UNKNOWN_DEFAULTS: { [key in LotionFieldType]: any } = {
   uuid: '',
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
}

const filterRow = (item: any): FilteredRow => {
   const result: FilteredRow = {}
   CONFIG.input.forEach((input: LotionInput) => {
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
         default:
            result[input.field] = rawValue
            return
      }
   })
   return result
}

const validateRow = (row: FilteredRow): boolean => {
   let isValid = true
   for (const { validate, field } of CONFIG.input) {
      const value = row[field]
      logger.verbose(`Validating (${value}) for ${field}`)
      if (validate && !validate(value, row)) {
         isValid = false
         logger.warn(`Input for '${field}' is invalid.`)
      }
   }
   return isValid
}

const transformRow = async (row: FilteredRow): Promise<FilteredRow> => {
   const transformed: FilteredRow = {}
   for await (const definition of CONFIG.input) {
      // save local files before transforming
      switch (definition.type) {
         case 'file':
         case 'image':
            let fileData: SchemaFile = await saveFileLocally(
               row[definition.field],
               CONTENT_PATH_ABSOLUTE,
               [row.id, sanitizeText(definition.field), 0].join('_')
            )
            fileData.path = CONTENT_PATH_RELATIVE || fileData.path
            row[definition.field] = fileData
            break
         case 'files':
         case 'images':
            row[definition.field] = await Promise.all(
               row[definition.field].map(async (remoteUrl: string, index: number) => {
                  let fileData: SchemaFile = await saveFileLocally(
                     remoteUrl,
                     CONTENT_PATH_ABSOLUTE,
                     [row.id, sanitizeText(definition.field), index].join('_')
                  )
                  fileData.path = CONTENT_PATH_RELATIVE || fileData.path
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
         transformed[definition.field] = definition.transform(row[definition.field], row)
      } else {
         transformed[definition.field] = row[definition.field]
      }
   }
   return transformed
}

const reshapeObject = (input: any, schema: any): any => {
   const reshaped: any = {}

   // assumes we have descended into an array of strings
   if (typeof schema === 'string') {
      return input[schema]
   }

   // assumes we have descended into an array
   if (Array.isArray(schema)) {
      return schema.map((item: any) => reshapeObject(input, item))
   }

   // assumes we have descended into an object
   // reshape the keys
   Object.keys(schema).forEach(key => {
      const value = schema[key]
      reshaped[key] = reshapeObject(input, value)
   })

   return reshaped
}

const getConfiguration = async () => {
   const cosmic: CosmiconfigResult = await explorer.search()
   if (cosmic.isEmpty) {
      throw new Error('No lotion configuration found. Aborting.')
   }

   CONFIG = cosmic.config

   // set the log level
   if (CONFIG.logLevel) {
      logger.logLevel = LoggerLogLevel[CONFIG.logLevel.toUpperCase() as keyof typeof LoggerLogLevel]
   }

   CONFIG_PATH_ABSOLUTE = path.dirname(cosmic.filepath)
   if (!CONFIG_PATH_ABSOLUTE) {
      throw new Error('Could not determine the absolute path of the configuration file. Aborting.')
   }
   logger.info(`Found lotion configuration at ${cosmic.filepath}`)

   // load environment variables
   if (CONFIG.envFile) {
      const envPath = path.join(CONFIG_PATH_ABSOLUTE, CONFIG.envFile)
      logger.info(`Loading environment variables from ${envPath}`)
      configDotenv({ path: envPath })
   }

   // make sure outputFiles exist
   if (!CONFIG.outputFiles || !CONFIG.outputFiles.length) {
      throw new Error('No output files specified. Aborting.')
   }

   // make sure outputFiles are of type json, js, or ts
   if (
      !CONFIG.outputFiles.every(
         (file: string) => file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts')
      )
   ) {
      throw new Error('Output files must be of type json, js, or ts. Aborting.')
   }

   // if the config.input contains a file(s) or image(s) field, make sure the contentDir is specified
   if (
      CONFIG.input.some((input: LotionInput) => input.type.includes('file') || input.type.includes('image')) &&
      !CONFIG.contentDir
   ) {
      throw new Error('A content directory must be specified if the input contains a file or image field. Aborting.')
   }

   // create the content directory if it doesn't exist
   if (CONFIG.contentDir) {
      CONTENT_PATH_RELATIVE = CONFIG.contentDir
      CONTENT_PATH_ABSOLUTE = path.join(CONFIG_PATH_ABSOLUTE, CONFIG.contentDir)
      if (!fs.existsSync(CONTENT_PATH_ABSOLUTE)) {
         logger.info(`Creating content directory at ${CONTENT_PATH_ABSOLUTE}`)
         fs.mkdirSync(CONTENT_PATH_ABSOLUTE, { recursive: true })
      }
   }
}

const createOutputFiles = async (formattedData: any) => {
   for await (const file of CONFIG.outputFiles) {
      const filePath = path.join(CONFIG_PATH_ABSOLUTE, file)
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
            useTypescriptTemplate(formattedData, filePath, CONFIG)
            break
         default:
            logger.error(`Unsupported file extension ${fileExtension}. Did not write create file.`)
            return
      }
   }
}

const main = async () => {
   // handle configuration
   try {
      await getConfiguration()
   } catch (error) {
      logger.error(error.message)
      return
   }

   // get all data from notion
   logger.info('Gathering data from Notion...')
   const notionData = await getAllNotionData(CONFIG.database, process.env.NOTION_TOKEN)

   // get the field that is the page title
   const pageTitleField = (CONFIG.input.find(input => input.isPageTitle) || { field: 'id' }).field
   logger.verbose(`Using "${pageTitleField}" as page title field`)

   const formattedData = []
   let numInvalid = 0
   let index = 0

   for await (const row of notionData as any) {
      index++
      logger.indent = 0

      progress = logger.getProgress(index, notionData.length)
      if (!row.properties) {
         logger.quiet(`${progress} Item ${row.id} has no properties. Skipping.`)
         continue
      }

      const pageTitle =
         pageTitleField === 'id'
            ? row.id
            : row.properties[pageTitleField].title.length
            ? row.properties[pageTitleField].title[0].plain_text
            : row.id
      logger.quiet(`${progress} Processing item for ${pageTitle}`)
      logger.indent = progress.length + 1

      // filter the raw data
      const filteredRow: FilteredRow = filterRow(row)

      // skip if invalid
      if (!validateRow(filteredRow)) {
         numInvalid++
         continue
      }

      // perform transformations
      const transformedRow: FilteredRow = await transformRow(filteredRow)

      // reshape the transformed input to match the schema
      const reshapedRow: any = reshapeObject(transformedRow, CONFIG.schema)

      // add the reshaped input to the formatted data
      formattedData.push(reshapedRow)
   }
   logger.indent = 0

   // write the formatted data to the output files
   await createOutputFiles(formattedData)

   logger.break()
   logger.success(`Processed ${formattedData.length} items.`)
   if (numInvalid > 0) {
      logger.warn(`${numInvalid} items were invalid and skipped. See above for details.`)
   }
}

main()
