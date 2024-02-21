import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { SchemaRichText } from 'src/types'

export const sanitizeText = (text: string) => {
   // remove all non-alphanumeric characters with '_'
   return text.replace(/[^a-z0-9]/gi, '_')
}

export const convertToPlaintext = (arr: TextRichTextItemResponse[]): string => {
   return arr
      .map(item => {
         if (item.type === 'text') {
            return item.plain_text
         }
         return ''
      })
      .join(' ')
}

export const convertToRichText = (arr: TextRichTextItemResponse[]): SchemaRichText[] => {
   return arr.map(item => ({
      text: item.plain_text,
      href: item.href,
      annotations: item.annotations,
   }))
}
