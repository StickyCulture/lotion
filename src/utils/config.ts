import path from 'path'

import { CosmiconfigResult, cosmiconfig } from 'cosmiconfig'
import { configDotenv } from 'dotenv'

import logger from './logger'

import { LoggerLogLevel, LotionConfig, LotionConstructor } from '../types'

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

export const generateParamsFromConfigFile = async (
   configFilePath?: string,
   envFile?: string
): Promise<LotionConstructor> => {
   const cosmic: CosmiconfigResult = await getCosmicConfig(configFilePath)
   const config: LotionConfig & LotionConstructor = { ...cosmic.config }

   const configDir = path.dirname(cosmic.filepath)
   config.basePath = configDir
   if (!config.basePath) {
      throw new Error('Could not determine the absolute path of the configuration file. Aborting.')
   }

   // set the log level
   if (config.logLevel) {
      logger.logLevel = LoggerLogLevel[config.logLevel.toUpperCase() as keyof typeof LoggerLogLevel]
   }

   // load environment variables
   loadEnvironmentVariables(config.envFile ? path.join(configDir, config.envFile) : envFile || '')

   // set token configuration
   if (!process.env.NOTION_IMPORT_TOKEN) {
      throw new Error('You must provide a NOTION_IMPORT_TOKEN environment variable')
   }

   config.import.token = process.env.NOTION_IMPORT_TOKEN

   if (config.export) {
      if (process.env.NOTION_EXPORT_TOKEN) {
         config.export.token = process.env.NOTION_EXPORT_TOKEN
      } else if (config.export.database === config.import.database) {
         config.export.token = config.import.token
      } else {
         throw new Error(
            'You must provide a NOTION_EXPORT_TOKEN environment variable for the export database if it is different than the import database.'
         )
      }
   }

   return config
}
