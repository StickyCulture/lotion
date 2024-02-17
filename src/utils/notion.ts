import { Client as NotionClient } from '@notionhq/client'

import { LotionFieldType, NotionDatabaseQueryParams } from 'src/types'

export const getAllNotionData = async (database_id: string, token: string, params: NotionDatabaseQueryParams) => {
   const NOTION = new NotionClient({ auth: token })

   const { sorts, filter } = params
   let limit = params.limit || Infinity

   let response = await NOTION.databases.query({
      database_id,
      sorts,
      filter,
      page_size: limit < 100 ? limit : undefined,
   })
   const results = response.results

   // cycle through all pages of results
   while (response.has_more && results.length < limit) {
      response = await NOTION.databases.query({
         database_id,
         sorts,
         filter,
         start_cursor: response.next_cursor,
      })
      results.push(...response.results)
   }

   limit = params.limit || results.length
   const offset = params.offset || 0

   if (limit < results.length || offset > 0) {
      return results.slice(offset, offset + limit)
   }

   return results
}

export const createPage = async (token: string, database_id: string, properties: any, children: any = []) => {
   const NOTION = new NotionClient({ auth: token })

   const response = await NOTION.pages.create({
      parent: {
         type: 'database_id',
         database_id,
      },
      properties,
      children,
   })

   return response
}

export const getPage = async (token: string, page_id: string) => {
   const NOTION = new NotionClient({ auth: token })

   const response = await NOTION.pages.retrieve({
      page_id,
   })

   return response
}

export const updatePageProperties = async (token: string, page_id: string, properties: any) => {
   const NOTION = new NotionClient({ auth: token })

   const response = await NOTION.pages.update({
      page_id,
      properties,
   })
   return response
}

export const formatExportData = (data: any, type: LotionFieldType) => {
   switch (type) {
      case 'title':
         return {
            type: 'title',
            title: [
               {
                  type: 'text',
                  text: {
                     content: `${data}`,
                  },
               },
            ],
         }
      case 'text':
      case 'richText':
         return {
            rich_text: `${data}`.split('\n').map((text: string) => {
               return {
                  type: 'text',
                  text: {
                     content: text,
                  },
               }
            }),
         }
      case 'number':
         return {
            number: data,
         }
      case 'boolean':
         return {
            checkbox: !!data,
         }
      case 'files':
      case 'file':
      case 'images':
      case 'image':
         throw new Error('File uploads are not supported in the Notion API')
      case 'option':
         return {
            select: {
               name: `${data}`,
            },
         }
      case 'options':
         // determine if the data is a string or an array
         if (Array.isArray(data)) {
            return {
               multi_select: data.map(option => {
                  return {
                     name: option,
                  }
               }),
            }
         } else {
            return {
               multi_select: [
                  {
                     name: `${data}`,
                  },
               ],
            }
         }
      case 'relation':
         return {
            relation: [
               {
                  id: `${data}`,
               },
            ],
         }
      case 'relations':
         return {
            relation: data.map((relation: string) => {
               return {
                  id: relation,
               }
            }),
         }
      case 'uuid':
      case 'index':
      default:
         // these types are not yet supported
         return undefined
   }
}
