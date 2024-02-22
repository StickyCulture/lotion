import { Client as NotionClient } from '@notionhq/client'
import {
   BlockObjectResponse,
   PartialBlockObjectResponse,
   PartialDatabaseObjectResponse,
   QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'

import { LotionFieldType, NotionDatabaseQueryParams } from 'src/types'

export const getDatabase = async (database_id: string, token: string): Promise<PartialDatabaseObjectResponse> => {
   const NOTION = new NotionClient({ auth: token })

   const response = await NOTION.databases.retrieve({
      database_id,
   })

   return response
}

export const getAllNotionData = async (database_id: string, token: string, params: NotionDatabaseQueryParams) => {
   const NOTION = new NotionClient({ auth: token })
   const { sorts, filter } = params

   const getOffsetCursor = async (offset: number | undefined): Promise<string | undefined> => {
      if (!offset) {
         return undefined
      }

      let response: Partial<QueryDatabaseResponse> = {
         has_more: true,
         next_cursor: undefined,
      }

      // cycle through all pages of results
      while (response.has_more && offset > 0) {
         response = await NOTION.databases.query({
            database_id,
            sorts,
            filter,
            page_size: offset < 100 ? offset : undefined,
            start_cursor: response.next_cursor,
         })
         offset -= response.results.length
      }

      return response.next_cursor
   }

   const getResults = async (
      next_cursor: string | undefined,
      limit: number | undefined
   ): Promise<QueryDatabaseResponse['results']> => {
      const results: QueryDatabaseResponse['results'] = []

      let response: Partial<QueryDatabaseResponse> = {
         has_more: true,
         next_cursor,
      }

      while (response.has_more && (!limit || results.length < limit)) {
         response = await NOTION.databases.query({
            database_id,
            sorts,
            filter,
            page_size: limit ? limit - results.length : undefined,
            start_cursor: response.next_cursor,
         })
         results.push(...response.results)
      }

      return results
   }

   const startingAt = await getOffsetCursor(params.offset)
   const results = await getResults(startingAt, params.limit)

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

export const getAllPageBlocks = async (
   block_id: string,
   token: string
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> => {
   const NOTION = new NotionClient({ auth: token })

   let response = await NOTION.blocks.children.list({
      block_id,
   })
   const results = response.results

   while (response.has_more) {
      try {
         response = await NOTION.blocks.children.list({
            block_id,
            start_cursor: response.next_cursor,
         })
         results.push(...response.results)
      } catch (e) {
         console.error(e)
      }
   }

   return results
}
