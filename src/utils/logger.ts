import { gray, yellow, red, green, blue } from 'colorette'

class Logger {
   constructor() {}

   success = (message: string) => {
      console.log(green(message))
   }

   warn = (message: string) => {
      console.log(yellow(message))
   }

   error = (message: string) => {
      console.log(red(message))
   }

   info = (message: string) => {
      console.log(blue(message))
   }

   quiet = (message: string) => {
      console.log(gray(message))
   }

   getProgress(current: number, total: number) {
      // get the number of digits in the total
      const totalDigits = total.toString().length
      // pad the current number with zeros to match the total digits
      const currentPadded = current.toString().padStart(totalDigits, '0')

      return `[${currentPadded} / ${total}]`
   }
}
export default Logger
