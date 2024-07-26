jest.mock('./notion')

import { faker } from '@faker-js/faker'

import { getAllNotionData } from './notion'

test('getData', async () => {
   const limit = faker.number.int(200)
   const data = await getAllNotionData('database_id', 'token', { limit })
   expect(data).toHaveLength(limit)
})
