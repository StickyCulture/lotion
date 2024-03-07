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

The default value to use if the field is not found in the Notion API response

#### Defined in

[src/types.ts:167](https://github.com/sticky/sticky-utils-lotion/blob/61d4e64/src/types.ts#L167)

___

### field

• **field**: `string`

The name of the field (property) in the Notion API response

Should exactly match the name of the property in the Notion database

#### Defined in

[src/types.ts:157](https://github.com/sticky/sticky-utils-lotion/blob/61d4e64/src/types.ts#L157)

___

### transform

• `Optional` **transform**: (`value`: `any`, `row`: `any`) => `Promise`\<`any`\>

A function to transform the value of the field

The function should return the transformed value

#### Type declaration

▸ (`value`, `row`): `Promise`\<`any`\>

A function to transform the value of the field

The function should return the transformed value

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `row` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[src/types.ts:179](https://github.com/sticky/sticky-utils-lotion/blob/61d4e64/src/types.ts#L179)

___

### type

• **type**: [`LotionFieldType`](../modules/types.md#lotionfieldtype)

The type of field to target in the Notion API response

This will determine the output type of the field when passing to `validate` and `transform` functions as well as the final `schema` object.

#### Defined in

[src/types.ts:163](https://github.com/sticky/sticky-utils-lotion/blob/61d4e64/src/types.ts#L163)

___

### validate

• `Optional` **validate**: (`value`: `any`, `row`: `any`) => `Promise`\<`boolean`\>

A function to validate the value of the field

If the function returns `false`, the associated row will be skipped

#### Type declaration

▸ (`value`, `row`): `Promise`\<`boolean`\>

A function to validate the value of the field

If the function returns `false`, the associated row will be skipped

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `row` | `any` |

##### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/types.ts:173](https://github.com/sticky/sticky-utils-lotion/blob/61d4e64/src/types.ts#L173)
