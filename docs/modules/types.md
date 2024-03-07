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

- [SchemaFile](../interfaces/types.SchemaFile.md)
- [SchemaIndex](../interfaces/types.SchemaIndex.md)
- [SchemaRichText](../interfaces/types.SchemaRichText.md)
- [SchemaBlock](types.md#schemablock)

## Configuration

• **LotionLogLevel**: `Object`

#### Defined in

[src/types.ts:16](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L16)

• **LotionConfig**: `Object`

The configuration object expected by the CLI when defined in a lotion.config.js file.

#### Defined in

[src/types.ts:260](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L260)

• **LotionExport**: `Object`

#### Defined in

[src/types.ts:251](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L251)

• **LotionField**: `Object`

#### Defined in

[src/types.ts:147](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L147)

• **LotionFieldExport**: `Object`

#### Defined in

[src/types.ts:181](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L181)

• **LotionImport**: `Object`

#### Defined in

[src/types.ts:191](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L191)

### LotionConstructor

Ƭ **LotionConstructor**: `Pick`\<[`LotionConfig`](../interfaces/types.LotionConfig.md), ``"contentDir"`` \| ``"outputFiles"`` \| ``"logLevel"``\> & \{ `basePath?`: `string` ; `export?`: [`LotionConfig`](../interfaces/types.LotionConfig.md)[``"export"``] & \{ `token`: `string`  } ; `import`: [`LotionConfig`](../interfaces/types.LotionConfig.md)[``"import"``] & \{ `token`: `string`  }  }

The constructor object expected by the Lotion class when used programmatically.

#### Defined in

[src/types.ts:289](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L289)

___

### LotionFieldType

Ƭ **LotionFieldType**: [`LotionFieldUuid`](types.md#lotionfielduuid) \| [`LotionFieldIndex`](types.md#lotionfieldindex) \| [`LotionFieldTitle`](types.md#lotionfieldtitle) \| [`LotionFieldText`](types.md#lotionfieldtext) \| [`LotionFieldRichText`](types.md#lotionfieldrichtext) \| [`LotionFieldNumber`](types.md#lotionfieldnumber) \| [`LotionFieldBoolean`](types.md#lotionfieldboolean) \| [`LotionFieldFiles`](types.md#lotionfieldfiles) \| [`LotionFieldImages`](types.md#lotionfieldimages) \| [`LotionFieldOptions`](types.md#lotionfieldoptions) \| [`LotionFieldRelations`](types.md#lotionfieldrelations) \| [`LotionFieldBlocks`](types.md#lotionfieldblocks)

#### Defined in

[src/types.ts:130](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L130)

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

[src/types.ts:125](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L125)

___

### LotionFieldBoolean

Ƭ **LotionFieldBoolean**: ``"boolean"``

Targets "Checkbox" type page properties (`checkbox` in Notion API response)

Outputs a `boolean` value

#### Defined in

[src/types.ts:81](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L81)

___

### LotionFieldFiles

Ƭ **LotionFieldFiles**: ``"file"`` \| ``"files"``

Targets "Files & Media" type page properties

Outputs a `SchemaFile` or `SchemaFile[]` value depending on plurality

**`See`**

SchemaFile

#### Defined in

[src/types.ts:90](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L90)

___

### LotionFieldImages

Ƭ **LotionFieldImages**: ``"image"`` \| ``"images"``

**`See`**

 - LotionFieldFiles
 - SchemaFile

#### Defined in

[src/types.ts:97](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L97)

___

### LotionFieldIndex

Ƭ **LotionFieldIndex**: ``"index"``

Targets "ID" type page properties (`unique_id` in Notion API response)

Outputs a `SchemaIndex` object

**`See`**

SchemaIndex

#### Defined in

[src/types.ts:38](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L38)

___

### LotionFieldNumber

Ƭ **LotionFieldNumber**: ``"number"``

Targets "Number" type page properties

Outputs a `number` value

#### Defined in

[src/types.ts:73](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L73)

___

### LotionFieldOptions

Ƭ **LotionFieldOptions**: ``"option"`` \| ``"options"``

Targets "Select" and "Multi Select" type page properties

Outputs a `string` or `string[]` value depending on plurality

#### Defined in

[src/types.ts:105](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L105)

___

### LotionFieldRelations

Ƭ **LotionFieldRelations**: ``"relation"`` \| ``"relations"``

Targets "Relation" type page properties

Outputs the relation page `id` as `string` or `string[]` value depending on plurality

#### Defined in

[src/types.ts:113](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L113)

___

### LotionFieldRichText

Ƭ **LotionFieldRichText**: ``"richText"``

Targets "Text" type page properties

Output a `SchemaRichText` array from the API's `rich_text` array

**`See`**

SchemaRichText

#### Defined in

[src/types.ts:65](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L65)

___

### LotionFieldText

Ƭ **LotionFieldText**: ``"text"``

Targets "Text" type page properties

Output a joined plaintext `string` from the API's `rich_text` array

#### Defined in

[src/types.ts:56](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L56)

___

### LotionFieldTitle

Ƭ **LotionFieldTitle**: ``"title"``

Targets the "Title" type page property (`title` in Notion API response)

Ouputs a `string` value

Note: value is used as an identifier in log output when supplied

#### Defined in

[src/types.ts:48](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L48)

___

### LotionFieldUuid

Ƭ **LotionFieldUuid**: ``"uuid"``

Targets the `id` of a Notion page

Outputs a `string` value

#### Defined in

[src/types.ts:29](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L29)

## Schema

• **SchemaFile**: `Object`

#### Defined in

[src/types.ts:307](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L307)

• **SchemaIndex**: `Object`

#### Defined in

[src/types.ts:318](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L318)

• **SchemaRichText**: `Object`

#### Defined in

[src/types.ts:298](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L298)

### SchemaBlock

Ƭ **SchemaBlock**: [`SchemaRichText`](../interfaces/types.SchemaRichText.md)[]

#### Defined in

[src/types.ts:327](https://github.com/sticky/sticky-utils-lotion/blob/07af671/src/types.ts#L327)
