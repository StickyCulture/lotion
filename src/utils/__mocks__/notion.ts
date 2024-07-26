import { faker } from '@faker-js/faker'

import { NotionDatabaseQueryParams } from 'src/types'

const getFakeTitle = () => {
   return {
      id: faker.string.uuid(),
      type: 'title',
      title: [
         {
            type: 'text',
            text: {
               content: faker.lorem.words(2),
            },
         },
      ],
   }
}

const getFakeText = () => {
   return {
      id: faker.string.uuid(),
      type: 'rich_text',
      rich_text: faker.lorem
         .sentences(6)
         .split('\n')
         .map((text: string, index: number) => {
            return {
               type: 'text',
               text: {
                  content: text,
                  link: null,
               },
               annotations: {
                  bold: index == 1,
                  italic: index == 2,
                  strikethrough: index == 3,
                  underline: index == 4,
                  code: index == 5,
                  color: 'default',
               },
               plain_text: text,
               href: null,
            }
         }),
   }
}

const getFakeTags = () => {
   const tags = []
   for (let i = 0; i < 6; i++) {
      tags.push({
         id: `tag-id-${i}`,
         name: `tag ${i}`,
         color: 'default',
      })
   }

   return {
      id: faker.string.uuid(),
      type: 'multi_select',
      multi_select: tags.filter(() => faker.datatype.boolean(0.7)),
   }
}

const getFakeRelation = () => {
   return {
      id: faker.string.uuid(),
      type: 'relation',
      relation: Array.from({ length: faker.number.int(3) }).map(() => {
         return {
            id: faker.string.uuid(),
         }
      }),
   }
}

export const getAllNotionData = async (database_id: string, token: string, params: NotionDatabaseQueryParams) => {
   const total = params.limit || 100
   const results = []
   for (let i = 0; i < total; i++) {
      const page = {
         object: 'page',
         id: faker.string.uuid(),
         properties: {
            'My ID': {
               id: faker.string.uuid(),
               type: 'unique_id',
               unique_id: {
                  prefix: 'PRE',
                  number: i,
               },
            },
            'My Title': getFakeTitle(),
            'My Text': getFakeText(),
            'My Tags': getFakeTags(),
            'My Relations': getFakeRelation(),
         },
      }
      results.push(page)
   }
   return results
}
