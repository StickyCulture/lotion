import fs from 'fs'
import path from 'path'

import { CosmiconfigResult, cosmiconfig } from 'cosmiconfig'
import { configDotenv } from 'dotenv'

import logger from './logger'

import { LotionParams, LotionOutputPaths, LoggerLogLevel, LotionField } from '../types'

export const getCosmicConfig = async (configFilePath?: string): Promise<CosmiconfigResult> => {
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

   // rewrite envFile path to be absolute if it exists
   if (config.envFile) {
      config.envFile = path.join(outputPath.data.absolute, config.envFile)
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

export const loadEnvironmentVariables = (path: string): void => {
   if (!path) {
      throw new Error('No environment file specified. Aborting.')
   }

   try {
      logger.info(`Loading environment variables from ${path}`)
      configDotenv({ path })
   } catch (error) {
      throw new Error(`Error loading environment variables: ${error.message}`)
   }
}

export const configureDatabaseTokens = (params: LotionParams): LotionParams => {
   loadEnvironmentVariables(params.config.envFile)

   if (!process.env.NOTION_IMPORT_TOKEN) {
      throw new Error('You must provide a NOTION_IMPORT_TOKEN environment variable')
   }

   params.config.import.token = process.env.NOTION_IMPORT_TOKEN

   if (params.config.export) {
      if (process.env.NOTION_EXPORT_TOKEN) {
         params.config.export.token = process.env.NOTION_EXPORT_TOKEN
      } else if (params.config.export.database === params.config.import.database) {
         params.config.export.token = params.config.import.token
      } else {
         throw new Error(
            'You must provide a NOTION_EXPORT_TOKEN environment variable for the export database if it is different than the import database.'
         )
      }
   }

   return params
}
