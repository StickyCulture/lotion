[sticky-utils-lotion](../README.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Lotion is a class that allows you to import data from Notion into a JSON, JS, or TS file or as a JavaScript object in memory.

Lotion automatically simplifies the data from Notion into a format that is easier to work with and allows you to apply additional transformations and validations before it is output. You define the schema you want for your data and Lotion will reshape the data to match that schema.

Lotion also allows you to export the data to another Notion database after transformations and validations.

Syncing the Notion data happens in 4 main stages. These are listed here to insight into the order of operations in case your transformers or validators are not behaving as expected.

1. Fetch the data from Notion and flatten it into a useable raw format.
1. Validate the raw data and cancel processing any data that is invalid. This is where the `validate` functions are run.
1. Transform the validated data based on the `transform` functions.
1. Re-shape the transformed data based on the `schema` definition.

Both validate and transform functions are each passed 2 arguments containing lightly pre-processed data from Notion. The first argument is the value of the field being processed and the second argument is the entire row of data being processed.

**`Example`**

```javascript
const lotion = new Lotion({
   contentDir: '/path/to/content',
   outputFiles: ['data.json'],
   import: {
      database: '12345678-1234-1234-1234-1234567890ab',
      token: 'secret_123',
      fields: [
         { name: 'id', type: 'uuid' },
         { name: 'Custom ID', type: 'index', transform: value => value.value },
         { name: 'Item Name', type: 'title' },
         { name: 'Description', type: 'richText' },
         { name: 'Subtitle', type: 'text' },
         { name: 'Files', type: 'files' },
         { name: 'Images', type: 'images' },
         { name: 'Category', type: 'option' },
         { name: 'Quantity', type: 'number' },
         { name: 'Tags', type: 'options', transform: arr => arr.map(item => item.toLowerCase())},
         { name: 'Is Published', type: 'boolean', validate: value => value },
         { name: 'Related', type: 'relation' },
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

[src/lotion.ts:122](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L122)

## Properties

### config

• `Private` **config**: [`LotionConstructor`](../modules/types.md#lotionconstructor)

#### Defined in

[src/lotion.ts:113](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L113)

___

### currentTitle

• `Private` **currentTitle**: `string` = `''`

#### Defined in

[src/lotion.ts:116](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L116)

___

### progress

• `Private` **progress**: `string` = `''`

#### Defined in

[src/lotion.ts:115](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L115)

## Accessors

### isMemoryOnly

• `get` **isMemoryOnly**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/lotion.ts:118](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L118)

## Methods

### cancel

▸ **cancel**(): `never`

#### Returns

`never`

#### Defined in

[src/lotion.ts:277](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L277)

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

[src/lotion.ts:522](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L522)

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

[src/lotion.ts:559](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L559)

___

### filterRow

▸ **filterRow**(`item`): `Promise`\<`FilteredRow`\>

The first stage of the import process. This function filters the raw data from Notion and returns a simplified object per Lotion's schema.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`FilteredRow`\>

#### Defined in

[src/lotion.ts:303](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L303)

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

[src/lotion.ts:499](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L499)

___

### run

▸ **run**(): `Promise`\<`any`[]\>

Run the Lotion instance

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[src/lotion.ts:170](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L170)

___

### testFields

▸ **testFields**(`scope`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | [`LotionImport`](../interfaces/types.LotionImport.md) & \{ `token`: `string`  } \| [`LotionExport`](../interfaces/types.LotionExport.md) & \{ `token`: `string`  } |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/lotion.ts:282](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L282)

___

### transformRow

▸ **transformRow**(`row`): `Promise`\<`FilteredRow`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | `FilteredRow` |

#### Returns

`Promise`\<`FilteredRow`\>

#### Defined in

[src/lotion.ts:452](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L452)

___

### validateRow

▸ **validateRow**(`row`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | `FilteredRow` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/lotion.ts:436](https://github.com/sticky/sticky-utils-lotion/blob/8cda98f/src/lotion.ts#L436)
