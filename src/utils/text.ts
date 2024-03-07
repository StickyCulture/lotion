import logger from './logger'

import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { SchemaRichText } from 'src/types'

export const sanitizeText = (text: string) => {
   // remove all non-alphanumeric characters with '_'
   return text.replace(/[^a-z0-9]/gi, '_')
}

export const convertToPlaintext = (input: TextRichTextItemResponse[] | string): string => {
   if (typeof input === 'string') {
      logger.warn('convertToPlaintext: input was a string, this may not be expected')
      return input
   }
   return input
      .map(item => {
         if (item.type === 'text') {
            return item.plain_text
         }
         return ''
      })
      .join(' ')
}

export const convertToRichText = (input: TextRichTextItemResponse[] | string): SchemaRichText[] => {
   if (typeof input === 'string') {
      logger.warn('convertToRichText: input was a string, this may not be expected')
      return [
         {
            text: input,
            href: null,
            annotations: {
               bold: false,
               italic: false,
               strikethrough: false,
               underline: false,
               code: false,
               color: 'default',
            },
         },
      ]
   }
   return input.map(item => ({
      text: item.plain_text,
      href: item.href,
      annotations: item.annotations,
   }))
}
