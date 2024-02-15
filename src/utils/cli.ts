import fs from 'fs'
import path from 'path'

import { CosmiconfigResult, cosmiconfig } from 'cosmiconfig'
import { configDotenv } from 'dotenv'

import logger from './logger'

import { LoggerLogLevel, LotionConfig, LotionField, LotionParams } from '../types'

export const generateParamsFromConfig = async (configFilePath?: string): Promise<LotionParams> => {
   let CONFIG_PATH_ABSOLUTE = ''
   let CONTENT_PATH_ABSOLUTE = ''
   let CONTENT_PATH_RELATIVE = ''
   let CONFIG: LotionConfig

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
      CONFIG.import.fields.some((input: LotionField) => input.type.includes('file') || input.type.includes('image')) &&
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

   return {
      config: CONFIG,
      outputPath: {
         data: {
            absolute: CONFIG_PATH_ABSOLUTE,
            relative: '',
         },
         content: {
            absolute: CONTENT_PATH_ABSOLUTE,
            relative: CONTENT_PATH_RELATIVE,
         },
      },
   }
}
