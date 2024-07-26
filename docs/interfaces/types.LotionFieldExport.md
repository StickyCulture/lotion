[sticky-utils-lotion](../README.md) / [types](../modules/types.md) / LotionFieldExport

# Interface: LotionFieldExport

[types](../modules/types.md).LotionFieldExport

## Hierarchy

- `Pick`\<[`LotionField`](types.LotionField.md), ``"name"`` \| ``"default"`` \| ``"type"``\>

  ↳ **`LotionFieldExport`**

## Table of contents

### Properties

- [default](types.LotionFieldExport.md#default)
- [input](types.LotionFieldExport.md#input)
- [name](types.LotionFieldExport.md#name)
- [type](types.LotionFieldExport.md#type)

## Properties

### default

• `Optional` **default**: `any`

The default value to use if the field is not found in the Notion API response

#### Inherited from

Pick.default

#### Defined in

[src/types.ts:185](https://github.com/sticky/sticky-utils-lotion/blob/6919cf3/src/types.ts#L185)

___

### input

• **input**: `string`

The key name from the `import.schema` object that this field should be mapped to when exporting

#### Defined in

[src/types.ts:207](https://github.com/sticky/sticky-utils-lotion/blob/6919cf3/src/types.ts#L207)

___

### name

• **name**: `string`

The name of the field (property) in the Notion API response

Should exactly match the name of the property in the Notion database

#### Inherited from

Pick.name

#### Defined in

[src/types.ts:175](https://github.com/sticky/sticky-utils-lotion/blob/6919cf3/src/types.ts#L175)

___

### type

• **type**: [`LotionFieldType`](../modules/types.md#lotionfieldtype)

The type of field to target in the Notion API response

This will determine the output type of the field when passing to `validate` and `transform` functions as well as the final `schema` object.

#### Inherited from

Pick.type

#### Defined in

[src/types.ts:181](https://github.com/sticky/sticky-utils-lotion/blob/6919cf3/src/types.ts#L181)
