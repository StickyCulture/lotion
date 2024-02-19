import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

import { CosmiconfigResult, cosmiconfig } from 'cosmiconfig'
import { configDotenv } from 'dotenv'

import logger from './logger'
import { sanitizeText } from './text'
import { measureImage } from './image'

import { SchemaFile, LotionConfig, LotionField, LotionParams, LoggerLogLevel, LotionOutputPaths } from '../types'

const splitExtension = (filename: string) => {
   const split = filename.split('.')
   if (split.length < 2)
      return {
         name: filename,
         extension: '',
      }

   // remove the last item from the array and return it as the extension
   // remove anything that begins after ? in the extension
   const extension = split.pop().replace(/\?.*/, '')
   const sanitizedSplits = split.map(part => {
      return sanitizeText(part)
   })
   const name = sanitizedSplits.join('.').replace(/\s+/g, '_')

   return {
      name,
      extension,
   }
}

export const saveFileLocally = async (
   remoteUrl: string,
   destinationPath: string,
   customFileName: string = ''
): Promise<SchemaFile> => {
   let result: SchemaFile = {
      path: destinationPath,
      name: '',
      extension: '',
      width: 0,
      height: 0,
   }

   if (!remoteUrl) {
      return result
   }

   const { name, extension } = splitExtension(remoteUrl)
   result.name = customFileName || name
   result.extension = extension
   const absolutePath = path.join(destinationPath, `${result.name}.${extension}`)

   // get the file from the url
   const fileResponse = await fetch(remoteUrl)
   const fileBuffer = await fileResponse.arrayBuffer()

   fs.writeFileSync(absolutePath, Buffer.from(fileBuffer))

   // if an image, get width and height
   if (extension.match(/(jpg|jpeg|png|webp)/)) {
      try {
         const measured: any = await measureImage(absolutePath)
         result.width = measured.width
         result.height = measured.height
      } catch (err) {
         if (logger.logLevel >= LoggerLogLevel.DEBUG) {
            logger.verbose(err)
         } else {
            logger.error(`Error measuring image: ${err.message}`)
         }
      }
   }

   return result
}

const getCosmicConfig = async (configFilePath?: string): Promise<CosmiconfigResult> => {
   const explorer = cosmiconfig('lotion')
   let cosmic: CosmiconfigResult
   if (configFilePath) {
      logger.info(`Loading configuration from ${configFilePath}`)
      cosmic = await explorer.load(configFilePath)
   } else {
      logger.info(`Searching for lotion configuration...`)
      cosmic = await explorer.search()
   }

   if (cosmic.isEmpty) {
      throw new Error('No lotion configuration found. Aborting.')
   }
   logger.info(`Found lotion configuration at ${cosmic.filepath}`)

   return cosmic
}

export const generateParamsFromConfigFile = async (configFilePath?: string): Promise<LotionParams> => {
   const cosmic: CosmiconfigResult = await getCosmicConfig(configFilePath)

   const config = { ...cosmic.config }
   const outputPath: LotionOutputPaths = {
      data: {
         absolute: '',
         relative: '',
      },
      content: {
         absolute: '',
         relative: '',
      },
   }

   // set the log level
   if (config.logLevel) {
      logger.logLevel = LoggerLogLevel[config.logLevel.toUpperCase() as keyof typeof LoggerLogLevel]
   }

   outputPath.data.absolute = path.dirname(cosmic.filepath)
   if (!outputPath.data.absolute) {
      throw new Error('Could not determine the absolute path of the configuration file. Aborting.')
   }

   // load environment variables
   if (config.envFile) {
      const envPath = path.join(outputPath.data.absolute, config.envFile)
      logger.info(`Loading environment variables from ${envPath}`)
      configDotenv({ path: envPath })
   }

   // make sure outputFiles exist
   if (!config.outputFiles || !config.outputFiles.length) {
      throw new Error('No output files specified. Aborting.')
   }

   // make sure outputFiles are of type json, js, or ts
   if (
      !config.outputFiles.every(
         (file: string) => file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts')
      )
   ) {
      throw new Error('Output files must be of type json, js, or ts. Aborting.')
   }

   // if the config.input contains a file(s) or image(s) field, make sure the contentDir is specified
   if (
      config.import.fields.some((input: LotionField) => input.type.includes('file') || input.type.includes('image')) &&
      !config.contentDir
   ) {
      throw new Error('A content directory must be specified if the input contains a file or image field. Aborting.')
   }

   // create the content directory if it doesn't exist
   if (config.contentDir) {
      outputPath.content.relative = config.contentDir
      outputPath.content.absolute = path.join(outputPath.data.absolute, config.contentDir)
      if (!fs.existsSync(outputPath.content.absolute)) {
         logger.info(`Creating content directory at ${outputPath.content.absolute}`)
         fs.mkdirSync(outputPath.content.absolute, { recursive: true })
      }
   }

   return {
      config,
      outputPath,
   }
}
