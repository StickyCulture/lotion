import Lotion from './lotion'
import { LotionConstructor, LotionLogLevel } from './types'

// returns fake output for getAllNotionData
jest.mock('./utils/notion')

// assume all specified fields exists
const spyOnTestFields = (lotionObj: any) =>
   jest.spyOn(lotionObj, 'testFields').mockImplementation(async () => {
      return []
   })

describe('Lotion', () => {
   it('should import data', async () => {
      const params: LotionConstructor = {
         outputFiles: ['memory'],
         logLevel: LotionLogLevel.NONE,
         import: {
            database: 'fake-database-id',
            token: 'fake-token',
            limit: 1,
            fields: [
               {
                  name: 'id',
                  type: 'uuid',
               },
               {
                  name: 'My Title',
                  type: 'title',
               },
               {
                  name: 'My Text',
                  type: 'text',
               },
               {
                  name: 'My Tags',
                  type: 'options',
               },
               {
                  name: 'My Relations',
                  type: 'relations',
               },
            ],
            schema: {
               id: 'id',
               title: 'My Title',
               text: 'My Text',
               tags: 'My Tags',
               relations: 'My Relations',
            },
         },
      }

      const lotion = new Lotion(params)
      spyOnTestFields(lotion)

      const data = await lotion.run()
      expect(data).toHaveLength(1)

      const item = data[0]
      expect(item).toHaveProperty('id')
      expect(item.id).toEqual(expect.any(String))

      expect(item).toHaveProperty('title')
      expect(item.title).toEqual(expect.any(String))

      expect(item).toHaveProperty('text')
      expect(item.text).toEqual(expect.any(String))

      expect(item).toHaveProperty('tags')
      expect(item.tags).toEqual(expect.any(Array))

      expect(item).toHaveProperty('relations')
      expect(item.relations).toEqual(expect.any(Array))
   })

   it('should import rich text', async () => {
      const params: LotionConstructor = {
         outputFiles: ['memory'],
         logLevel: LotionLogLevel.NONE,
         import: {
            database: 'fake-database-id',
            token: 'fake-token',
            limit: 1,
            fields: [
               {
                  name: 'id',
                  type: 'uuid',
               },
               {
                  name: 'My Text',
                  type: 'richText',
               },
            ],
            schema: {
               id: 'id',
               richText: 'My Text',
            },
         },
      }

      const lotion = new Lotion(params)
      spyOnTestFields(lotion)

      const data = await lotion.run()
      expect(data).toHaveLength(1)

      const item = data[0]
      expect(item).toHaveProperty('id')
      expect(item.id).toEqual(expect.any(String))

      expect(item).toHaveProperty('richText')
      expect(item.richText).toEqual(expect.any(Array))

      const richText = item.richText[0]
      expect(richText).toHaveProperty('text')
      expect(richText.text).toEqual(expect.any(String))

      expect(richText).toHaveProperty('href')
      expect(richText.href).toBeNull()

      expect(richText).toHaveProperty('annotations')
      expect(richText.annotations).toEqual(expect.any(Object))

      const annotations = richText.annotations
      expect(annotations).toHaveProperty('bold')
      expect(annotations.bold).toEqual(expect.any(Boolean))

      expect(annotations).toHaveProperty('italic')
      expect(annotations.italic).toEqual(expect.any(Boolean))

      expect(annotations).toHaveProperty('strikethrough')
      expect(annotations.strikethrough).toEqual(expect.any(Boolean))

      expect(annotations).toHaveProperty('underline')
      expect(annotations.underline).toEqual(expect.any(Boolean))

      expect(annotations).toHaveProperty('code')
      expect(annotations.code).toEqual(expect.any(Boolean))

      expect(annotations).toHaveProperty('color')
      expect(annotations.color).toEqual(expect.any(String))
   })
})
