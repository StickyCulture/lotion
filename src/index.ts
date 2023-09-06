import fs from 'fs'
import path from 'path'

import { configDotenv } from 'dotenv'
import { cosmiconfig } from 'cosmiconfig'

import Logger from './utils/logger'
import { getAllNotionData } from './utils/notion'
import { saveFileLocally } from './utils/file'

import { useJsonTemplate } from './template/json'
import { useJavascriptTemplate } from './template/javascript'
import { useTypescriptTemplate } from './template/typescript'

import { LotionFieldType, LotionInput, LotionConfig, SchemaFile, LoggerLogLevel, LotionLogLevel } from './types'
import { sanitizeText } from './utils/text'

const logger = new Logger()
const explorer = cosmiconfig('lotion')

let progress = ''
let CONTENT_PATH_ABSOLUTE = ''
let CONTENT_PATH_RELATIVE = ''

const UNKNOWN_FILE: SchemaFile = {
   path: '',
   name: '',
   extension: '',
   width: 0,
   height: 0,
}

const UNKNOWN_DEFAULTS: { [key in LotionFieldType]: any } = {
   uuid: '',
   text: '',
   richText: [],
   number: 0,
   boolean: false,
   files: [],
   file: UNKNOWN_FILE,
   images: [],
   image: UNKNOWN_FILE,
   options: [],
   option: '',
}

const getRawInput = (inputDefinitions: LotionInput[], item: any) => {
   const result: any = {}
   inputDefinitions.forEach((input: LotionInput) => {
      // logger.quiet(`Getting raw input for ${input.field}`)

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
      // logger.quiet(`Raw value for ${input.field} is ${rawValue}`)
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
            result[input.field] = rawValue.length > 0 ? rawValue[0] : defaultValue
            return
         case 'files':
         case 'images':
            // multiple values are allowed for these types
            result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.file.url) : defaultValue
            return
         case 'options':
            // multiple values are allowed for these types
            result[input.field] = rawValue.length > 0 ? rawValue.map((item: any) => item.name) : defaultValue
            return
         default:
            result[input.field] = rawValue
            return
      }
   })
   return result
}

const reshapeObject = (input: any, schema: any) => {
   const reshaped: any = {}
   Object.keys(schema).forEach(key => {
      const value = schema[key]
      if (typeof value === 'string') {
         reshaped[key] = input[value]
      } else if (typeof value === 'object') {
         reshaped[key] = reshapeObject(input, value)
      }
   })
   return reshaped
}

const main = async () => {
   let configFile: any
   let config: LotionConfig = {} as LotionConfig

   try {
      configFile = await explorer.search()
      if (configFile.isEmpty) {
         throw new Error('No lotion configuration found. Aborting.')
      }
      config = configFile.config
   } catch (err) {
      logger.error(err)
      return
   }

   // set the log level
   if (config.logLevel) {
      logger.logLevel = LoggerLogLevel[config.logLevel.toUpperCase() as keyof typeof LoggerLogLevel]
   }

   logger.info(`Found lotion configuration at ${configFile.filepath}`)

   if (config.envFile) {
      const envPath = path.join(path.dirname(configFile.filepath), config.envFile)
      logger.info(`Loading environment variables from ${envPath}`)
      configDotenv({ path: envPath })
   }

   logger.info('Applying lotion...')

   // get all data from notion
   const notionData = await getAllNotionData(config.database, process.env.NOTION_TOKEN)

   // get the field that is the page title
   const pageTitleField = (config.input.find(input => input.isPageTitle) || { field: 'id' }).field

   // make sure outputFiles are specified and of type 'json' |'js' | 'ts'
   if (!config.outputFiles || !config.outputFiles.length) {
      logger.error('No output files specified. Aborting.')
      return
   }
   if (
      !config.outputFiles.every(
         (file: string) => file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts')
      )
   ) {
      logger.error('Output files must be of type json, js, or ts. Aborting.')
      return
   }

   // if the config.input contains a file(s) or image(s) field, make sure the contentDir is specified
   if (
      config.input.some((input: LotionInput) => input.type.includes('file') || input.type.includes('image')) &&
      !config.contentDir
   ) {
      logger.error('A content directory must be specified if the input contains a file or image field. Aborting.')
      return
   }

   // create the content directory if it doesn't exist
   if (config.contentDir) {
      CONTENT_PATH_RELATIVE = config.contentDir
      CONTENT_PATH_ABSOLUTE = path.join(path.dirname(configFile.filepath), config.contentDir)
      if (!fs.existsSync(CONTENT_PATH_ABSOLUTE)) {
         logger.quiet(`Creating content directory at ${CONTENT_PATH_ABSOLUTE}`)
         fs.mkdirSync(CONTENT_PATH_ABSOLUTE, { recursive: true })
      }
   }

   const formattedData = []
   let numInvalid = 0
   let index = 0

   for await (const item of notionData as any) {
      index++
      logger.indent = 0

      progress = logger.getProgress(index, notionData.length)
      if (!item.properties) {
         logger.quiet(`${progress} Item ${item.id} has no properties. Skipping.`)
         continue
      }

      const pageTitle =
         pageTitleField === 'id'
            ? item.id
            : item.properties[pageTitleField].title.length
            ? item.properties[pageTitleField].title[0].plain_text
            : item.id
      logger.quiet(`${progress} Processing item for ${pageTitle}`)
      logger.indent = progress.length + 1

      // get raw input
      const rawInput: any = getRawInput(config.input, item)

      // validate input
      let isValid = true
      for await (const definition of config.input) {
         // logger.quiet(`Validating (${rawInput[definition.field]}) for ${definition.field}`)
         if (definition.validate && !definition.validate(rawInput[definition.field], rawInput)) {
            isValid = false
            logger.warn(`Input for '${definition.field}' is invalid.`)
         }
      }
      // skip if invalid
      if (!isValid) {
         numInvalid++
         continue
      }

      // perform transformations
      const transformedInput: any = {}
      for await (const definition of config.input) {
         // save local files before transforming
         switch (definition.type) {
            case 'file':
            case 'image':
               let fileData: SchemaFile = await saveFileLocally(
                  rawInput[definition.field],
                  CONTENT_PATH_ABSOLUTE,
                  [rawInput.id, sanitizeText(definition.field), 0].join('_')
               )
               fileData.path = CONTENT_PATH_RELATIVE || fileData.path
               rawInput[definition.field] = fileData
               break
            case 'files':
            case 'images':
               rawInput[definition.field] = await Promise.all(
                  rawInput[definition.field].map(async (remoteUrl: string, index: number) => {
                     let fileData: SchemaFile = await saveFileLocally(
                        remoteUrl,
                        CONTENT_PATH_ABSOLUTE,
                        [rawInput.id, sanitizeText(definition.field), index].join('_')
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
            transformedInput[definition.field] = definition.transform(rawInput[definition.field], rawInput)
         } else {
            transformedInput[definition.field] = rawInput[definition.field]
         }
      }

      // reshape the transformed input to match the schema
      const reshaped: any = reshapeObject(transformedInput, config.schema)

      // add the reshaped input to the formatted data
      formattedData.push(reshaped)
   }
   logger.indent = 0

   // write the formatted data to the output files
   for await (const file of config.outputFiles) {
      const filePath = path.join(path.dirname(configFile.filepath), file)
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
            useTypescriptTemplate(formattedData, filePath, config)
            break
         default:
            logger.error(`Unsupported file extension ${fileExtension}. Aborting.`)
            return
      }
   }

   logger.break()
   logger.success(`Processed ${formattedData.length} items.`)
   if (numInvalid > 0) {
      logger.warn(`${numInvalid} items were invalid and skipped. See above for details.`)
   }
}

main()
