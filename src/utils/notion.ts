import { Client as NotionClient } from '@notionhq/client'

const NOTION = new NotionClient({ auth: process.env.NOTION_TOKEN })

export const getAllNotionData = async (database_id: string) => {
   let response = await NOTION.databases.query({
      database_id,
   })
   const results = response.results

   // cycle through all pages of results
   while (response.has_more) {
      response = await NOTION.databases.query({
         database_id,
         start_cursor: response.next_cursor,
      })
      results.push(...response.results)
   }

   return results
}
