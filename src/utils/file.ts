import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

import { sanitizeText } from './text'

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
   sourceUrl: string,
   destinationPath: string,
   customFileName: string = '',
   indentLength: number = 2
) => {
   if (!sourceUrl) return ''

   const { name, extension } = splitExtension(sourceUrl)
   const fileName = customFileName || name
   const filePath = path.join(destinationPath, `${fileName}.${extension}`)
   console.info(`${' '.repeat(indentLength)}downloading file: ${name}.${extension} to ${filePath}`)

   // get the file from the url
   const fileResponse = await fetch(sourceUrl)
   const fileBuffer = await fileResponse.arrayBuffer()

   fs.writeFileSync(filePath, Buffer.from(fileBuffer))

   return {
      fullPath: filePath,
      relativePath: filePath.split('public/')[1],
   }
}
