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
         { field: 'Item Name', type: 'title' },
         { field: 'Description', type: 'richText' },
         { field: 'Subtitle', type: 'text' },
         { field: 'Files', type: 'files' },
         { field: 'Images', type: 'images' },
         { field: 'Category', type: 'option' },
         { field: 'Quantity', type: 'number' },
         { field: 'Tags', type: 'options' },
         { field: 'Is Published', type: 'boolean' },
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
         isVisible: 'Is Published',
         related: 'Related',
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

[src/lotion.ts:103](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L103)

## Properties

### config

• `Private` **config**: [`LotionConstructor`](../modules/types.md#lotionconstructor)

#### Defined in

[src/lotion.ts:94](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L94)

___

### currentTitle

• `Private` **currentTitle**: `string` = `''`

#### Defined in

[src/lotion.ts:97](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L97)

___

### progress

• `Private` **progress**: `string` = `''`

#### Defined in

[src/lotion.ts:96](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L96)

## Accessors

### isMemoryOnly

• `get` **isMemoryOnly**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/lotion.ts:99](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L99)

## Methods

### cancel

▸ **cancel**(): `never`

#### Returns

`never`

#### Defined in

[src/lotion.ts:234](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L234)

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

[src/lotion.ts:445](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L445)

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

[src/lotion.ts:482](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L482)

___

### filterRow

▸ **filterRow**(`item`): [`FilteredRow`](../interfaces/types.FilteredRow.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

[`FilteredRow`](../interfaces/types.FilteredRow.md)

#### Defined in

[src/lotion.ts:262](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L262)

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

[src/lotion.ts:422](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L422)

___

### run

▸ **run**(): `Promise`\<`any`\>

Run the Lotion instance

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/lotion.ts:147](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L147)

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

[src/lotion.ts:239](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L239)

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

[src/lotion.ts:375](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L375)

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

[src/lotion.ts:359](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/lotion.ts#L359)
