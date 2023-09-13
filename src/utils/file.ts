import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

import logger from './logger'
import { sanitizeText } from './text'
import { measureImage } from './image'

import { LoggerLogLevel, SchemaFile } from '../types'

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
         result.width = measured.pages[0].width
         result.height = measured.pages[0].height
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
