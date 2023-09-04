import path from 'path'

import { configDotenv } from 'dotenv'
import { cosmiconfig } from 'cosmiconfig'

import Logger from './utils/logger'
import { getAllNotionData } from './utils/notion'

const logger = new Logger()
const explorer = cosmiconfig('lotion')

type LotionFieldType =
   | 'uuid'
   | 'text'
   | 'richText'
   | 'number'
   | 'boolean'
   | 'files'
   | 'file'
   | 'images'
   | 'image'
   | 'options'
   | 'option'

interface LotionInput {
   field: string
   type: LotionFieldType
   default: any
   isPrimary?: boolean
   validate?: (value: any, item: any) => boolean
   transform?: (value: any, item: any) => any
}

interface LotionConfig {
   envFile?: string
   database: string
   input: LotionInput[]
   output: any
}

const main = async () => {
   let configFile: any
   let config: LotionConfig = { envFile: '', database: '', input: [], output: {} }

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

   console.log(configFile.filepath)
   const x = path.join('hello', 'world')
   console.log(x)

   // logger.quiet(`Found lotion configuration at ${configFile.filepath}`)

   // if (config.envFile) {
   //    const envPath = path.join(path.dirname(configFile.filepath), config.envFile)
   //    logger.quiet(`Loading environment variables from ${envPath}`)
   //    configDotenv({ path: envPath })
   // }

   // logger.quiet(`Found Notion token: ${process.env.NOTION_TOKEN}`)

   // logger.info('Applying lotion...')

   // const notionData = await getAllNotionData(config.database)
}

main()
