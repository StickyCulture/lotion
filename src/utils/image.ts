import imageSize from 'image-size'

export const measureImage = (image: Buffer) => {
   return new Promise((resolve, reject) => {
      const dimensions = imageSize(image)
      if (dimensions) {
         resolve(dimensions)
      } else {
         reject(new Error('Could not measure image'))
      }
   })
}
