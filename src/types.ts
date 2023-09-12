export enum LoggerLogLevel {
   NONE,
   NORMAL,
   DETAILED,
   DEBUG,
}

export enum LotionLogLevel {
   NONE = 'none',
   NORMAL = 'normal',
   DETAILED = 'detailed',
   DEBUG = 'debug',
}

export type LotionFieldType =
   | 'uuid'
   | 'text'
   | 'richText'
   | 'number'
   | 'boolean'
   | 'files'
   | 'file'
   | 'images'
   | 'image'
   | 'options'
   | 'option'
   | 'relation'
   | 'relations'

export interface LotionInput {
   field: string
   type: LotionFieldType
   default?: any
   isPageTitle?: boolean
   validate?: (value: any, item: any) => Promise<boolean>
   transform?: (value: any, item: any) => Promise<any>
}

export interface LotionConfig {
   envFile?: string
   database: string
   contentDir?: string
   outputFiles: string[]
   logLevel: LotionLogLevel
   input: LotionInput[]
   schema: { [key: string]: string | object }
   postProcess?: (data: any) => Promise<any>
}

export interface SchemaFile {
   path: string
   name: string
   extension: string
   width: number
   height: number
}

export interface FilteredRow {
   [field: string]: any
}
