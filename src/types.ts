import { QueryDatabaseParameters, TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

/**
 * @hidden
 */
export enum LoggerLogLevel {
   NONE,
   NORMAL,
   DETAILED,
   DEBUG,
}

/**
 * @group Configuration
 */
export enum LotionLogLevel {
   NONE = 'none',
   NORMAL = 'normal',
   DETAILED = 'detailed',
   DEBUG = 'debug',
}

/**
 * Targets the `id` of a Notion page
 *
 * Outputs a `string` value
 * @group Fields
 */
export type LotionFieldUuid = 'uuid'

/**
 * Targets "ID" type page properties (`unique_id` in Notion API response)
 *
 * Outputs a `SchemaIndex` object
 * @see SchemaIndex
 * @group Fields
 */
export type LotionFieldIndex = 'index'

/**
 * Targets the "Title" type page property (`title` in Notion API response)
 *
 * Ouputs a `string` value
 *
 * Note: value is used as an identifier in log output when defined
 * @group Fields
 */
export type LotionFieldTitle = 'title'

/**
 * Targets "Text" type page properties.
 * Can also be used for "Formula" type page properties that output a string value
 *
 * Output a joined plaintext `string` from the API's `rich_text` array
 * @group Fields
 */
export type LotionFieldText = 'text'

/**
 * Targets "Text" type page properties.
 * Can also be used for "Formula" type page properties that output a string value
 *
 * Output a `SchemaRichText` array from the API's `rich_text` array.
 * @see SchemaRichText
 * @group Fields
 */
export type LotionFieldRichText = 'richText'

/**
 * Targets "Number" type page properties
 *
 * Outputs a `number` value
 * @group Fields
 */
export type LotionFieldNumber = 'number'

/**
 * Targets "Checkbox" type page properties (`checkbox` in Notion API response)
 * Can also be used for "Formula" type page properties that output a boolean value
 *
 * Outputs a `boolean` value
 * @group Fields
 */
export type LotionFieldBoolean = 'boolean'

/**
 * Targets "Files & Media" type page properties
 *
 * Outputs a `SchemaFile` or `SchemaFile[]` value depending on plurality
 * @see SchemaFile
 * @group Fields
 */
export type LotionFieldFiles = 'file' | 'files'

/**
 * @see LotionFieldFiles
 * @see SchemaFile
 * @group Fields
 */
export type LotionFieldImages = 'image' | 'images'

/**
 * Targets "Select" and "Multi Select" type page properties.
 * Can also be used for comma-separated strings such as those generated by "Formula" type page properties.
 *
 * Outputs a `string` or `string[]` value depending on plurality
 * @group Fields
 */
export type LotionFieldOptions = 'option' | 'options'

/**
 * Targets "Relation" type page properties
 *
 * Outputs the relation page `id` as `string` or `string[]` value depending on plurality
 * @group Fields
 */
export type LotionFieldRelations = 'relation' | 'relations'

/**
 * Targets the child "Blocks" of a Page object
 *
 * Outputs a `SchemaBlock[]` value of all rich text content within the Page
 *
 * Note: this field type only supports first-level rich text content and will ignore further nested content such as tables or linked pages
 * @see SchemaBlock
 * @see SchemaRichText
 * @group Fields
 */
export type LotionFieldBlocks = 'blocks'

/**
 * @group Configuration
 */
export type LotionFieldType =
   | LotionFieldUuid
   | LotionFieldIndex
   | LotionFieldTitle
   | LotionFieldText
   | LotionFieldRichText
   | LotionFieldNumber
   | LotionFieldBoolean
   | LotionFieldFiles
   | LotionFieldImages
   | LotionFieldOptions
   | LotionFieldRelations
   | LotionFieldBlocks

/**
 * @group Configuration
 */
export interface LotionField {
   /**
    * The name of the field (property) in the Notion API response
    *
    * Should exactly match the name of the property in the Notion database
    */
   field: string
   /**
    * The type of field to target in the Notion API response
    *
    * This will determine the output type of the field when passing to `validate` and `transform` functions as well as the final `schema` object.
    */
   type: LotionFieldType
   /**
    * The default value to use if the field is not found in the Notion API response
    */
   default?: any
   /**
    * A function to validate the value of the field
    *
    * If the function returns `false`, the associated row will be skipped
    */
   validate?: (value: any, row: any) => Promise<boolean>
   /**
    * A function to transform the value of the field
    *
    * The function should return the transformed value
    */
   transform?: (value: any, row: any) => Promise<any>
}

/**
 * @group Configuration
 */
export interface LotionFieldExport extends Pick<LotionField, 'field' | 'default' | 'type'> {
   /**
    * The key name from the `import.schema` object that this field should be mapped to when exporting
    */
   input: string
}

/**
 * @group Configuration
 */
export interface LotionImport {
   /**
    * The Notion database ID to query
    */
   database: string
   /**
    * Filter arguments for the query, see [Notion API documentation](https://developers.notion.com/reference/post-database-query) for more information
    */
   filters?: QueryDatabaseParameters['filter']
   /**
    * Sort arguments for the query, see [Notion API documentation](https://developers.notion.com/reference/post-database-query) for more information
    */
   sorts?: QueryDatabaseParameters['sorts']
   /**
    * The maximum number of records to return
    */
   limit?: number
   /**
    * The number of records to skip before returning results. Will operate on the default Notion sort order unless a custom `sorts` array is provided.
    */
   offset?: number
   /**
    * An array of field definitions to import from the Notion API response
    */
   fields: LotionField[]
   /**
    * A object describing your desired output schema for the importd data. Values may be either a `string` that matches a field name from the `fields` array or an object that describes a nested schema.
    *
    * If you are adding fields into the schema that do not have corresponding columns from the Notion database, you should still create the `LotionField` definition for it and provide a `default` value. The sync will ignore any fields that are not present in the Notion database and simply provide the `default` value.
    *
    * @example
    * ```javascript
    * fields: [
    *    { field: 'My Notion Title', type: 'title' },
    *    { field: 'My Rich Text Field', type: 'richText' },
    *    { field: 'My Images', type: 'images' },
    *    { field: '_not_in_the_database', type: 'number', default: Math.random() }
    * ],
    * schema: {
    *    title: 'My Notion Title',
    *    body: {
    *       text: 'My Rich Text Field',
    *       images: 'My Images',
    *    },
    *   randomNumber: '_not_in_the_database'
    * }
    * ```
    */
   schema: { [key: string]: string | object }
   /**
    * A hook function that runs immediately after all imported rows have been processed with `transform` and `validate` functions and just before the final export and write to output files. This function should return the final array of data to be exported.
    * @param data - The array of data that has been processed
    * @returns A promise that resolves with the final array of data to be exported
    */
   postProcess?: (data: any[]) => Promise<any[]>
}

/**
 * @group Configuration
 */
export interface LotionExport {
   database: string
   fields: LotionFieldExport[]
}

/**
 * The configuration object expected by the CLI when defined in a lotion.config.js file.
 * @group Configuration
 */
export interface LotionConfig {
   /**
    * Path to a `.env` file to load environment variables from
    */
   envFile?: string
   /**
    * Path to the directory where imported Files and Media will be saved
    */
   contentDir?: string
   /**
    * Paths to output files that will be generated.
    *
    * Filenames must either end in __.json__, __.js__, or __.ts__ in order to be output.
    *
    * Value may be the special keyword `memory` to prevent writing to disk. Result will be an array returned from the `Lotion().run` function.
    */
   outputFiles: string[]
   /**
    * Logging level to use for the application
    */
   logLevel?: LotionLogLevel
   import: LotionImport
   export?: LotionExport
}

/**
 * The constructor object expected by the Lotion class when used programmatically.
 * @group Configuration
 */
export type LotionConstructor = Pick<LotionConfig, 'contentDir' | 'outputFiles' | 'logLevel'> & {
   import: LotionConfig['import'] & { token: string }
   export?: LotionConfig['export'] & { token: string }
   basePath?: string
}

/**
 * @group Schema
 */
export interface SchemaRichText {
   text: string
   href: string | null
   annotations: TextRichTextItemResponse['annotations']
}

/**
 * @group Schema
 */
export interface SchemaFile {
   path: string
   name: string
   extension: string
   width: number
   height: number
}

/**
 * @group Schema
 */
export interface SchemaIndex {
   number: number
   prefix: string
   value: string
}

/**
 * @group Schema
 */
export type SchemaBlock = SchemaRichText[]

/**
 * @hidden
 */
export interface FilteredRow {
   [field: string]: any
}

/**
 * @hidden
 */
export type NotionDatabaseQueryParams = {
   sorts?: QueryDatabaseParameters['sorts']
   filter?: QueryDatabaseParameters['filter']
   limit?: number
   offset?: number
}
