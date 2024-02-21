[sticky-utils-lotion](../README.md) / [types](../modules/types.md) / LotionImport

# Interface: LotionImport

[types](../modules/types.md).LotionImport

## Table of contents

### Properties

- [database](types.LotionImport.md#database)
- [fields](types.LotionImport.md#fields)
- [filters](types.LotionImport.md#filters)
- [limit](types.LotionImport.md#limit)
- [offset](types.LotionImport.md#offset)
- [postProcess](types.LotionImport.md#postprocess)
- [schema](types.LotionImport.md#schema)
- [sorts](types.LotionImport.md#sorts)

## Properties

### database

• **database**: `string`

#### Defined in

[src/types.ts:47](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L47)

___

### fields

• **fields**: [`LotionField`](types.LotionField.md)[]

#### Defined in

[src/types.ts:52](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L52)

___

### filters

• `Optional` **filters**: `PropertyFilter` \| `TimestampCreatedTimeFilter` \| `TimestampLastEditedTimeFilter` \| \{ `or`: PropertyFilter \| TimestampCreatedTimeFilter \| TimestampLastEditedTimeFilter \| \{ or: PropertyFilter[]; } \| \{ ...; }[]  } \| \{ `and`: PropertyFilter \| TimestampCreatedTimeFilter \| TimestampLastEditedTimeFilter \| \{ or: PropertyFilter[]; } \| \{ ...; }[]  }

#### Defined in

[src/types.ts:48](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L48)

___

### limit

• `Optional` **limit**: `number`

#### Defined in

[src/types.ts:50](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L50)

___

### offset

• `Optional` **offset**: `number`

#### Defined in

[src/types.ts:51](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L51)

___

### postProcess

• `Optional` **postProcess**: (`data`: `any`) => `Promise`\<`any`\>

#### Type declaration

▸ (`data`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[src/types.ts:54](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L54)

___

### schema

• **schema**: `Object`

#### Index signature

▪ [key: `string`]: `string` \| `object`

#### Defined in

[src/types.ts:53](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L53)

___

### sorts

• `Optional` **sorts**: (\{ `direction`: ``"ascending"`` \| ``"descending"`` ; `property`: `string`  } \| \{ `direction`: ``"ascending"`` \| ``"descending"`` ; `timestamp`: ``"created_time"`` \| ``"last_edited_time"``  })[]

#### Defined in

[src/types.ts:49](https://github.com/sticky/sticky-utils-lotion/blob/0fd9242/src/types.ts#L49)
