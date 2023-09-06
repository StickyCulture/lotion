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

export interface LotionInput {
   field: string
   type: LotionFieldType
   default?: any
   isPageTitle?: boolean
   validate?: (value: any, item: any) => boolean
   transform?: (value: any, item: any) => any
}

export interface LotionConfig {
   envFile?: string
   database: string
   contentDir?: string
   outputFiles: string[]
   input: LotionInput[]
   schema: { [key: string]: string | object }
}

export interface SchemaFile {
   path: string
   name: string
   extension: string
   width: number
   height: number
}
