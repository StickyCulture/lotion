import { QueryDatabaseParameters, TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

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
   | 'index'
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
   | 'blocks'

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
   filters?: QueryDatabaseParameters['filter']
   sorts?: QueryDatabaseParameters['sorts']
   limit?: number
   offset?: number
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
   logLevel?: LotionLogLevel
   import: LotionImport
   export?: LotionExport
}

export type LotionConstructor = Pick<LotionConfig, 'contentDir' | 'outputFiles' | 'logLevel'> & {
   import: LotionConfig['import'] & { token: string }
   export?: LotionConfig['export'] & { token: string }
   basePath?: string
}

export interface LotionEnvironment {
   notionImportToken: string
   notionExportToken: string
}

export interface SchemaRichText {
   text: string
   href: string | null
   annotations: TextRichTextItemResponse['annotations']
}

export interface SchemaFile {
   path: string
   name: string
   extension: string
   width: number
   height: number
}

export interface SchemaIndex {
   number: number
   prefix: string
   value: string
}

export interface FilteredRow {
   [field: string]: any
}

export type NotionDatabaseQueryParams = {
   sorts?: QueryDatabaseParameters['sorts']
   filter?: QueryDatabaseParameters['filter']
   limit?: number
   offset?: number
}
