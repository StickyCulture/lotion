import { Command } from 'commander'

import Lotion from './lotion'
import logger from './utils/logger'
import { generateParamsFromConfigFile } from './utils/config'

const program = new Command()

const handleCli = async () => {
   program.name('sticky-utils-lotion')
   program.description('Copy a Notion database to a local place')
   program.option('-c --config <path>', 'path to config file')
   program.option('-e --env <path>', 'path to .env file')
   program.option('--notion-import-token <token>', 'Notion token for the import database')
   program.option('--notion-export-token <token>', 'Notion token for the export database')
   program.parse()

   const options = program.opts()

   const environmentOptions = {
      file: options.env,
      importToken: options.notionImportToken,
      exportToken: options.notionExportToken,
   }

   // handle configuration
   const config = await generateParamsFromConfigFile(options.config, environmentOptions)

   const lotion = new Lotion(config)
   await lotion.run()
}

try {
   handleCli()
} catch (error) {
   logger.error(error.message)
}
