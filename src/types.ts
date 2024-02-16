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
   | 'title'
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

export interface LotionField {
   field: string
   type: LotionFieldType
   default?: any
   validate?: (value: any, item: any) => Promise<boolean>
   transform?: (value: any, item: any) => Promise<any>
}

export interface LotionFieldExport extends Pick<LotionField, 'field' | 'default' | 'type'> {
   input: string
}

export interface LotionImport {
   database: string
   fields: LotionField[]
   schema: { [key: string]: string | object }
   postProcess?: (data: any) => Promise<any>
}

export interface LotionExport {
   database: string
   fields: LotionFieldExport[]
}

export interface LotionConfig {
   envFile?: string
   contentDir?: string
   outputFiles: string[]
   logLevel: LotionLogLevel
   import: LotionImport
   export?: LotionExport
}

export interface LotionPath {
   absolute: string
   relative: string
}

export interface LotionOutputPaths {
   data: LotionPath
   content: LotionPath
}

export interface LotionParams {
   config: LotionConfig
   outputPath: LotionOutputPaths
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

export interface LotionCliOptions {
   config?: string
}
