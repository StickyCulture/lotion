import { Command } from 'commander'

import Lotion from './lotion'
import logger from './utils/logger'
import { generateParamsFromConfigFile } from './utils/file'

import { LotionCliOptions, LotionParams } from './types'

const program = new Command()

const handleCli = async () => {
   program.name('sticky-utils-lotion')
   program.description('Copy a Notion database to a local place')
   program.option('-c --config <path>', 'path to config file')
   program.parse()

   const options: LotionCliOptions = program.opts()

   // handle configuration
   let params: LotionParams
   try {
      params = await generateParamsFromConfigFile(options.config)
   } catch (error) {
      logger.error(error.message)
      return
   }

   const lotion = new Lotion(params)
   await lotion.run()
}

handleCli()
