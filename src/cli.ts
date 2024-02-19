import { Command } from 'commander'

import Lotion from './lotion'
import logger from './utils/logger'
import { configureDatabaseTokens, generateParamsFromConfigFile } from './utils/config'

import { LotionParams } from './types'

const program = new Command()

const handleCli = async () => {
   program.name('sticky-utils-lotion')
   program.description('Copy a Notion database to a local place')
   program.option('-c --config <path>', 'path to config file')
   program.option('-e --env <path>', 'path to .env file')
   program.parse()

   const options = program.opts()

   // handle configuration
   let params: LotionParams
   try {
      params = await generateParamsFromConfigFile(options.config)
      if (options.env) {
         params.config.envFile = options.env
      }
      params = configureDatabaseTokens(params)
   } catch (error) {
      logger.error(error.message)
      return
   }

   const lotion = new Lotion(params)
   await lotion.run()
}

try {
   handleCli()
} catch (error) {
   logger.error(error.message)
}
