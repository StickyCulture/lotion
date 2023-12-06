import imageSize from 'image-size'

export const measureImage = async (image: string) => {
   return new Promise((resolve, reject) => {
      imageSize(image, (err, dimensions) => {
         if (err) {
            reject(err)
         } else {
            resolve(dimensions)
         }
      })
   })
}
