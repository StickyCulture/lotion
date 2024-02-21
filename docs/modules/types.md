[sticky-utils-lotion](../README.md) / types

# Module: types

## Table of contents

### Enumerations

- [LoggerLogLevel](../enums/types.LoggerLogLevel.md)
- [LotionLogLevel](../enums/types.LotionLogLevel.md)

### Interfaces

- [FilteredRow](../interfaces/types.FilteredRow.md)
- [LotionConfig](../interfaces/types.LotionConfig.md)
- [LotionEnvironment](../interfaces/types.LotionEnvironment.md)
- [LotionExport](../interfaces/types.LotionExport.md)
- [LotionField](../interfaces/types.LotionField.md)
- [LotionFieldExport](../interfaces/types.LotionFieldExport.md)
- [LotionImport](../interfaces/types.LotionImport.md)
- [SchemaFile](../interfaces/types.SchemaFile.md)
- [SchemaIndex](../interfaces/types.SchemaIndex.md)

### Type Aliases

- [LotionConstructor](types.md#lotionconstructor)
- [LotionFieldType](types.md#lotionfieldtype)
- [NotionDatabaseQueryParams](types.md#notiondatabasequeryparams)

## Type Aliases

### LotionConstructor

Ƭ **LotionConstructor**: `Pick`\<[`LotionConfig`](../interfaces/types.LotionConfig.md), ``"contentDir"`` \| ``"outputFiles"`` \| ``"logLevel"``\> & \{ `basePath?`: `string` ; `export?`: [`LotionConfig`](../interfaces/types.LotionConfig.md)[``"export"``] & \{ `token`: `string`  } ; `import`: [`LotionConfig`](../interfaces/types.LotionConfig.md)[``"import"``] & \{ `token`: `string`  }  }

#### Defined in

[src/types.ts:71](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L71)

___

### LotionFieldType

Ƭ **LotionFieldType**: ``"uuid"`` \| ``"index"`` \| ``"title"`` \| ``"text"`` \| ``"richText"`` \| ``"number"`` \| ``"boolean"`` \| ``"files"`` \| ``"file"`` \| ``"images"`` \| ``"image"`` \| ``"options"`` \| ``"option"`` \| ``"relation"`` \| ``"relations"``

#### Defined in

[src/types.ts:17](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L17)

___

### NotionDatabaseQueryParams

Ƭ **NotionDatabaseQueryParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filter?` | `QueryDatabaseParameters`[``"filter"``] |
| `limit?` | `number` |
| `offset?` | `number` |
| `sorts?` | `QueryDatabaseParameters`[``"sorts"``] |

#### Defined in

[src/types.ts:100](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L100)
