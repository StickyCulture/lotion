[sticky-utils-lotion](../README.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Lotion is a class that allows you to import data from Notion into a JSON, JS, or TS file or as a JavaScript object in memory.

Lotion automatically simplifies the data from Notion into a format that is easier to work with and allows you to apply additional transformations and validations before it is output. You define the schema you want for your data and Lotion will reshape the data to match that schema.

Lotion also allows you to export the data to another Notion database after transformations and validations.

**`Example`**

```ts
const lotion = new Lotion({
   contentDir: '/path/to/content',
   outputFiles: ['data.json'],
   import: {
      database: '12345678-1234-1234-1234-1234567890ab',
      token: 'secret_123
      fields: [
         { field: 'id', type: 'uuid' },
         { field: 'Custom ID', type: 'index', transform: value => value.value },
         { field: 'Item Name', type: 'title' },
         { field: 'Description', type: 'richText' },
         { field: 'Subtitle', type: 'text' },
         { field: 'Files', type: 'files' },
         { field: 'Images', type: 'images' },
         { field: 'Category', type: 'option' },
         { field: 'Quantity', type: 'number' },
         { field: 'Tags', type: 'options', transform: arr => arr.map(item => item.toLowerCase())},
         { field: 'Is Published', type: 'boolean', validate: value => value },
         { field: 'Related', type: 'relation' },
      ],
      schema: {
         id: 'id',
         title: 'Item Name',
         subtitle: 'Subtitle',
         description: 'Description',
         media: {
            files: 'Files',
            images: 'Images',
         },
         category: 'Category',
         quantity: 'Quantity',
         tags: 'Tags',
         related: 'Related',
         notionPageId: 'id',
         notionLookupId: 'Custom ID',
      },
   },
})
const data = await lotion.run()
```

## Table of contents

### Constructors

- [constructor](index.default.md#constructor)

### Properties

- [config](index.default.md#config)
- [currentTitle](index.default.md#currenttitle)
- [progress](index.default.md#progress)

### Accessors

- [isMemoryOnly](index.default.md#ismemoryonly)

### Methods

- [cancel](index.default.md#cancel)
- [createOutputFiles](index.default.md#createoutputfiles)
- [exportData](index.default.md#exportdata)
- [filterRow](index.default.md#filterrow)
- [reshapeObject](index.default.md#reshapeobject)
- [run](index.default.md#run)
- [testFields](index.default.md#testfields)
- [transformRow](index.default.md#transformrow)
- [validateRow](index.default.md#validaterow)

## Constructors

### constructor

• **new default**(`params`): [`default`](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LotionConstructor`](../modules/types.md#lotionconstructor) |

#### Returns

[`default`](index.default.md)

#### Defined in

[src/lotion.ts:108](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L108)

## Properties

### config

• `Private` **config**: [`LotionConstructor`](../modules/types.md#lotionconstructor)

#### Defined in

[src/lotion.ts:99](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L99)

___

### currentTitle

• `Private` **currentTitle**: `string` = `''`

#### Defined in

[src/lotion.ts:102](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L102)

___

### progress

• `Private` **progress**: `string` = `''`

#### Defined in

[src/lotion.ts:101](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L101)

## Accessors

### isMemoryOnly

• `get` **isMemoryOnly**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/lotion.ts:104](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L104)

## Methods

### cancel

▸ **cancel**(): `never`

#### Returns

`never`

#### Defined in

[src/lotion.ts:237](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L237)

___

### createOutputFiles

▸ **createOutputFiles**(`formattedData`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `formattedData` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/lotion.ts:464](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L464)

___

### exportData

▸ **exportData**(`formattedData`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `formattedData` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/lotion.ts:501](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L501)

___

### filterRow

▸ **filterRow**(`item`): `Promise`\<[`FilteredRow`](../interfaces/types.FilteredRow.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`FilteredRow`](../interfaces/types.FilteredRow.md)\>

#### Defined in

[src/lotion.ts:265](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L265)

___

### reshapeObject

▸ **reshapeObject**(`input`, `schema`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `any` |
| `schema` | `any` |

#### Returns

`any`

#### Defined in

[src/lotion.ts:441](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L441)

___

### run

▸ **run**(): `Promise`\<`any`\>

Run the Lotion instance

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/lotion.ts:151](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L151)

___

### testFields

▸ **testFields**(`scope`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | [`LotionImport`](../interfaces/types.LotionImport.md) & \{ `token`: `string`  } \| [`LotionExport`](../interfaces/types.LotionExport.md) & \{ `token`: `string`  } |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/lotion.ts:242](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L242)

___

### transformRow

▸ **transformRow**(`row`): `Promise`\<[`FilteredRow`](../interfaces/types.FilteredRow.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`FilteredRow`](../interfaces/types.FilteredRow.md) |

#### Returns

`Promise`\<[`FilteredRow`](../interfaces/types.FilteredRow.md)\>

#### Defined in

[src/lotion.ts:394](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L394)

___

### validateRow

▸ **validateRow**(`row`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`FilteredRow`](../interfaces/types.FilteredRow.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/lotion.ts:378](https://github.com/sticky/sticky-utils-lotion/blob/688c116/src/lotion.ts#L378)
