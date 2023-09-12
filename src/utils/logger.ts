import { gray, yellow, red, green, blue } from 'colorette'

import { LoggerLogLevel } from '../types'

class Logger {
   private static instance: Logger

   public indent: number = 0
   public logLevel: LoggerLogLevel = LoggerLogLevel.NORMAL

   private constructor() {}

   static getInstance(): Logger {
      if (!Logger.instance) {
         Logger.instance = new Logger()
      }
      return Logger.instance
   }

   success = (message: string, indentOverride?: number) => {
      if (this.logLevel < LoggerLogLevel.NORMAL) return
      console.log(this.getIndent(indentOverride), green(message))
   }

   warn = (message: string, indentOverride?: number) => {
      if (this.logLevel < LoggerLogLevel.NORMAL) return
      console.log(this.getIndent(indentOverride), yellow(message))
   }

   error = (message: string, indentOverride?: number) => {
      console.log(this.getIndent(indentOverride), red(message))
   }

   info = (message: string, indentOverride?: number) => {
      if (this.logLevel < LoggerLogLevel.NORMAL) return
      console.log(this.getIndent(indentOverride), blue(message))
   }

   quiet = (message: string, indentOverride?: number) => {
      if (this.logLevel < LoggerLogLevel.DETAILED) return
      console.log(this.getIndent(indentOverride), gray(message))
   }

   verbose = (message: any) => {
      if (this.logLevel < LoggerLogLevel.DEBUG) return
      console.log(message)
   }

   break = (n: number = 0) => {
      if (this.logLevel < LoggerLogLevel.NORMAL) return
      console.log('\n'.repeat(n))
   }

   getProgress(current: number, total: number) {
      // get the number of digits in the total
      const totalDigits = total.toString().length
      // pad the current number with zeros to match the total digits
      const currentPadded = current.toString().padStart(totalDigits, '0')

      return `[${currentPadded} / ${total}]`
   }

   private getIndent = (indentOverride?: number) =>
      ' '.repeat(typeof indentOverride === undefined ? this.indent : indentOverride)
}

export default Logger.getInstance()
