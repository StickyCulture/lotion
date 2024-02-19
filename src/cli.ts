import { Command } from 'commander'

import Lotion from './lotion'
import logger from './utils/logger'
import { generateParamsFromConfigFile, loadEnvironmentVariables } from './utils/config'

import { LotionEnvironment } from './types'

const program = new Command()

const handleCli = async () => {
   program.name('sticky-utils-lotion')
   program.description('Copy a Notion database to a local place')
   program.option('-c --config <path>', 'path to config file')
   program.option('-e --env <path>', 'path to .env file')
   program.parse()

   const options = program.opts()

   // handle configuration
   const { config, outputPath } = await generateParamsFromConfigFile(options.config)

   // load environment variables
   loadEnvironmentVariables(config.envFile || options.env)

   // set token configuration
   const environment: LotionEnvironment = { notionImportToken: '', notionExportToken: '' }

   if (!process.env.NOTION_IMPORT_TOKEN) {
      throw new Error('You must provide a NOTION_IMPORT_TOKEN environment variable')
   }

   environment.notionImportToken = process.env.NOTION_IMPORT_TOKEN

   if (config.export) {
      if (process.env.NOTION_EXPORT_TOKEN) {
         environment.notionExportToken = process.env.NOTION_EXPORT_TOKEN
      } else if (config.export.database === config.import.database) {
         environment.notionExportToken = environment.notionImportToken
      } else {
         throw new Error(
            'You must provide a NOTION_EXPORT_TOKEN environment variable for the export database if it is different than the import database.'
         )
      }
   }

   const lotion = new Lotion(config, environment, outputPath)
   await lotion.run()
}

try {
   handleCli()
} catch (error) {
   logger.error(error.message)
}
