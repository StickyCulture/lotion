import { gray, yellow, red, green, blue } from 'colorette'

class Logger {
   public indent: number = 0

   constructor() {}

   success = (message: string, indentOverride: number = 0) => {
      console.log(' '.repeat(indentOverride || this.indent), green(message))
   }

   warn = (message: string, indentOverride: number = 0) => {
      console.log(' '.repeat(indentOverride || this.indent), yellow(message))
   }

   error = (message: string, indentOverride: number = 0) => {
      console.log(' '.repeat(indentOverride || this.indent), red(message))
   }

   info = (message: string, indentOverride: number = 0) => {
      console.log(' '.repeat(indentOverride || this.indent), blue(message))
   }

   quiet = (message: string, indentOverride: number = 0) => {
      console.log(' '.repeat(indentOverride || this.indent), gray(message))
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
