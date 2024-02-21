[sticky-utils-lotion](../README.md) / [types](../modules/types.md) / LotionField

# Interface: LotionField

[types](../modules/types.md).LotionField

## Table of contents

### Properties

- [default](types.LotionField.md#default)
- [field](types.LotionField.md#field)
- [transform](types.LotionField.md#transform)
- [type](types.LotionField.md#type)
- [validate](types.LotionField.md#validate)

## Properties

### default

• `Optional` **default**: `any`

#### Defined in

[src/types.ts:37](https://github.com/sticky/sticky-utils-lotion/blob/2800d26/src/types.ts#L37)

___

### field

• **field**: `string`

#### Defined in

[src/types.ts:35](https://github.com/sticky/sticky-utils-lotion/blob/2800d26/src/types.ts#L35)

___

### transform

• `Optional` **transform**: (`value`: `any`, `item`: `any`) => `Promise`\<`any`\>

#### Type declaration

▸ (`value`, `item`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `item` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[src/types.ts:39](https://github.com/sticky/sticky-utils-lotion/blob/2800d26/src/types.ts#L39)

___

### type

• **type**: [`LotionFieldType`](../modules/types.md#lotionfieldtype)

#### Defined in

[src/types.ts:36](https://github.com/sticky/sticky-utils-lotion/blob/2800d26/src/types.ts#L36)

___

### validate

• `Optional` **validate**: (`value`: `any`, `item`: `any`) => `Promise`\<`boolean`\>

#### Type declaration

▸ (`value`, `item`): `Promise`\<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `item` | `any` |

##### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/types.ts:38](https://github.com/sticky/sticky-utils-lotion/blob/2800d26/src/types.ts#L38)
