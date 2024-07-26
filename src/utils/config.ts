import path from 'path'

import { CosmiconfigResult, cosmiconfig } from 'cosmiconfig'
import { configDotenv } from 'dotenv'

import logger from './logger'

import { EnvironmentOptions, LoggerLogLevel, LotionConfig, LotionConstructor } from '../types'

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
   environmentOptions?: EnvironmentOptions
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

   // Important: CLI options override configuration file settings
   environmentOptions = environmentOptions || {}
   environmentOptions.file = environmentOptions.file || config.envFile
   // load environment variables
   if (environmentOptions.file) {
      loadEnvironmentVariables(environmentOptions.file)
   }

   // set token configuration
   config.import.token = environmentOptions.importToken || process.env.NOTION_IMPORT_TOKEN
   if (!config.import.token) {
      throw new Error(
         'You must provide a Notion token for imports either in the .env file (NOTION_IMPORT_TOKEN) or as a CLI option (--notion-import-token).'
      )
   }

   if (config.export) {
      config.export.token = environmentOptions.exportToken || process.env.NOTION_EXPORT_TOKEN

      // if the export database is the same as the import database, use the same token
      if (!config.export.token && config.export.database === config.import.database) {
         config.export.token = config.import.token
      } else {
         throw new Error(
            'You must provide a Notion token for exports either in the .env file (NOTION_EXPORT_TOKEN) or as a CLI option (--notion-export-token).'
         )
      }
   }

   return config
}
