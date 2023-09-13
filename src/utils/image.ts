import Calipers from 'calipers'
import { Result as CalipersResult } from 'calipers/src'
const calipers = Calipers('png', 'jpeg', 'webp')

export const measureImage = async (image: string) => {
   return new Promise((resolve, reject) => {
      calipers
         .measure(image)
         .then((result: CalipersResult) => resolve(result))
         .catch((err: Error) => reject(err))
   })
}
