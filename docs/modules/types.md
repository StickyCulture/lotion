[sticky-utils-lotion](../README.md) / types

# Module: types

## Table of contents

### Configuration

- [LotionLogLevel](../enums/types.LotionLogLevel.md)
- [LotionConfig](../interfaces/types.LotionConfig.md)
- [LotionExport](../interfaces/types.LotionExport.md)
- [LotionField](../interfaces/types.LotionField.md)
- [LotionFieldExport](../interfaces/types.LotionFieldExport.md)
- [LotionImport](../interfaces/types.LotionImport.md)
- [LotionConstructor](types.md#lotionconstructor)
- [LotionFieldType](types.md#lotionfieldtype)

### Fields

- [LotionFieldBlocks](types.md#lotionfieldblocks)
- [LotionFieldBoolean](types.md#lotionfieldboolean)
- [LotionFieldDate](types.md#lotionfielddate)
- [LotionFieldFiles](types.md#lotionfieldfiles)
- [LotionFieldImages](types.md#lotionfieldimages)
- [LotionFieldIndex](types.md#lotionfieldindex)
- [LotionFieldNumber](types.md#lotionfieldnumber)
- [LotionFieldOptions](types.md#lotionfieldoptions)
- [LotionFieldRelations](types.md#lotionfieldrelations)
- [LotionFieldRichText](types.md#lotionfieldrichtext)
- [LotionFieldText](types.md#lotionfieldtext)
- [LotionFieldTitle](types.md#lotionfieldtitle)
- [LotionFieldUuid](types.md#lotionfielduuid)

### Schema

- [SchemaDate](../interfaces/types.SchemaDate.md)
- [SchemaFile](../interfaces/types.SchemaFile.md)
- [SchemaIndex](../interfaces/types.SchemaIndex.md)
- [SchemaRichText](../interfaces/types.SchemaRichText.md)
- [SchemaBlock](types.md#schemablock)

## Configuration

• **LotionLogLevel**: `Object`

#### Defined in

[src/types.ts:16](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L16)

• **LotionConfig**: `Object`

The configuration object expected by the CLI when defined in a lotion.config.js file.

#### Defined in

[src/types.ts:273](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L273)

• **LotionExport**: `Object`

#### Defined in

[src/types.ts:264](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L264)

• **LotionField**: `Object`

#### Defined in

[src/types.ts:160](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L160)

• **LotionFieldExport**: `Object`

#### Defined in

[src/types.ts:194](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L194)

• **LotionImport**: `Object`

#### Defined in

[src/types.ts:204](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L204)

### LotionConstructor

Ƭ **LotionConstructor**: `Pick`\<[`LotionConfig`](../interfaces/types.LotionConfig.md), ``"contentDir"`` \| ``"outputFiles"`` \| ``"logLevel"``\> & \{ `basePath?`: `string` ; `export?`: [`LotionConfig`](../interfaces/types.LotionConfig.md)[``"export"``] & \{ `token`: `string`  } ; `import`: [`LotionConfig`](../interfaces/types.LotionConfig.md)[``"import"``] & \{ `token`: `string`  }  }

The constructor object expected by the Lotion class when used programmatically.

#### Defined in

[src/types.ts:302](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L302)

___

### LotionFieldType

Ƭ **LotionFieldType**: [`LotionFieldUuid`](types.md#lotionfielduuid) \| [`LotionFieldIndex`](types.md#lotionfieldindex) \| [`LotionFieldTitle`](types.md#lotionfieldtitle) \| [`LotionFieldText`](types.md#lotionfieldtext) \| [`LotionFieldRichText`](types.md#lotionfieldrichtext) \| [`LotionFieldNumber`](types.md#lotionfieldnumber) \| [`LotionFieldBoolean`](types.md#lotionfieldboolean) \| [`LotionFieldDate`](types.md#lotionfielddate) \| [`LotionFieldFiles`](types.md#lotionfieldfiles) \| [`LotionFieldImages`](types.md#lotionfieldimages) \| [`LotionFieldOptions`](types.md#lotionfieldoptions) \| [`LotionFieldRelations`](types.md#lotionfieldrelations) \| [`LotionFieldBlocks`](types.md#lotionfieldblocks)

#### Defined in

[src/types.ts:142](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L142)

## Fields

### LotionFieldBlocks

Ƭ **LotionFieldBlocks**: ``"blocks"``

Targets the child "Blocks" of a Page object

Outputs a `SchemaBlock[]` value of all rich text content within the Page

Note: this field type only supports first-level rich text content and will ignore further nested content such as tables or linked pages

**`See`**

 - SchemaBlock
 - SchemaRichText

#### Defined in

[src/types.ts:137](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L137)

___

### LotionFieldBoolean

Ƭ **LotionFieldBoolean**: ``"boolean"``

Targets "Checkbox" type page properties (`checkbox` in Notion API response)
Can also be used for "Formula" type page properties that output a boolean value

Outputs a `boolean` value

#### Defined in

[src/types.ts:84](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L84)

___

### LotionFieldDate

Ƭ **LotionFieldDate**: ``"date"``

Targets "Date" type page properties,

Outputs a `SchemaDate` object

#### Defined in

[src/types.ts:92](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L92)

___

### LotionFieldFiles

Ƭ **LotionFieldFiles**: ``"file"`` \| ``"files"``

Targets "Files & Media" type page properties

Outputs a `SchemaFile` or `SchemaFile[]` value depending on plurality

**`See`**

SchemaFile

#### Defined in

[src/types.ts:101](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L101)

___

### LotionFieldImages

Ƭ **LotionFieldImages**: ``"image"`` \| ``"images"``

**`See`**

 - LotionFieldFiles
 - SchemaFile

#### Defined in

[src/types.ts:108](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L108)

___

### LotionFieldIndex

Ƭ **LotionFieldIndex**: ``"index"``

Targets "ID" type page properties (`unique_id` in Notion API response)

Outputs a `SchemaIndex` object

**`See`**

SchemaIndex

#### Defined in

[src/types.ts:38](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L38)

___

### LotionFieldNumber

Ƭ **LotionFieldNumber**: ``"number"``

Targets "Number" type page properties

Outputs a `number` value

#### Defined in

[src/types.ts:75](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L75)

___

### LotionFieldOptions

Ƭ **LotionFieldOptions**: ``"option"`` \| ``"options"``

Targets "Select" and "Multi Select" type page properties.
Can also be used for comma-separated strings such as those generated by "Formula" type page properties.

Outputs a `string` or `string[]` value depending on plurality

#### Defined in

[src/types.ts:117](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L117)

___

### LotionFieldRelations

Ƭ **LotionFieldRelations**: ``"relation"`` \| ``"relations"``

Targets "Relation" type page properties

Outputs the relation page `id` as `string` or `string[]` value depending on plurality

#### Defined in

[src/types.ts:125](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L125)

___

### LotionFieldRichText

Ƭ **LotionFieldRichText**: ``"richText"``

Targets "Text" type page properties.
Can also be used for "Formula" type page properties that output a string value

Output a `SchemaRichText` array from the API's `rich_text` array.

**`See`**

SchemaRichText

#### Defined in

[src/types.ts:67](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L67)

___

### LotionFieldText

Ƭ **LotionFieldText**: ``"text"``

Targets "Text" type page properties.
Can also be used for "Formula" type page properties that output a string value

Output a joined plaintext `string` from the API's `rich_text` array

#### Defined in

[src/types.ts:57](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L57)

___

### LotionFieldTitle

Ƭ **LotionFieldTitle**: ``"title"``

Targets the "Title" type page property (`title` in Notion API response)

Ouputs a `string` value

Note: value is used as an identifier in log output when defined

#### Defined in

[src/types.ts:48](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L48)

___

### LotionFieldUuid

Ƭ **LotionFieldUuid**: ``"uuid"``

Targets the `id` of a Notion page

Outputs a `string` value

#### Defined in

[src/types.ts:29](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L29)

## Schema

• **SchemaDate**: `Object`

A date range object in UTC time. The `end` value may be `null` if the date is singular or the range is open-ended.

#### Defined in

[src/types.ts:341](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L341)

• **SchemaFile**: `Object`

#### Defined in

[src/types.ts:320](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L320)

• **SchemaIndex**: `Object`

#### Defined in

[src/types.ts:331](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L331)

• **SchemaRichText**: `Object`

#### Defined in

[src/types.ts:311](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L311)

### SchemaBlock

Ƭ **SchemaBlock**: [`SchemaRichText`](../interfaces/types.SchemaRichText.md)[]

#### Defined in

[src/types.ts:349](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L349)
