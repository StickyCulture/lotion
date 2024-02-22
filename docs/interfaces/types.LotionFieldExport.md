[sticky-utils-lotion](../README.md) / [types](../modules/types.md) / LotionFieldExport

# Interface: LotionFieldExport

[types](../modules/types.md).LotionFieldExport

## Hierarchy

- `Pick`\<[`LotionField`](types.LotionField.md), ``"field"`` \| ``"default"`` \| ``"type"``\>

  ↳ **`LotionFieldExport`**

## Table of contents

### Properties

- [default](types.LotionFieldExport.md#default)
- [field](types.LotionFieldExport.md#field)
- [input](types.LotionFieldExport.md#input)
- [type](types.LotionFieldExport.md#type)

## Properties

### default

• `Optional` **default**: `any`

The default value to use if the field is not found in the Notion API response

#### Inherited from

Pick.default

#### Defined in

[src/types.ts:163](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L163)

___

### field

• **field**: `string`

The name of the field (property) in the Notion API response

Should exactly match the name of the property in the Notion database

#### Inherited from

Pick.field

#### Defined in

[src/types.ts:153](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L153)

___

### input

• **input**: `string`

The key name from the `import.schema` object that this field should be mapped to when exporting

#### Defined in

[src/types.ts:185](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L185)

___

### type

• **type**: [`LotionFieldType`](../modules/types.md#lotionfieldtype)

The type of field to target in the Notion API response

This will determine the output type of the field when passing to `validate` and `transform` functions as well as the final `schema` object.

#### Inherited from

Pick.type

#### Defined in

[src/types.ts:159](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L159)
