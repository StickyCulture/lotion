[sticky-utils-lotion](../README.md) / index

# Module: index

## Table of contents

### Classes

- [default](../classes/index.default.md)

### Functions

- [generateParamsFromConfigFile](index.md#generateparamsfromconfigfile)
- [getCosmicConfig](index.md#getcosmicconfig)

## Functions

### generateParamsFromConfigFile

▸ **generateParamsFromConfigFile**(`configFilePath?`, `envFile?`): `Promise`\<[`LotionConstructor`](types.md#lotionconstructor)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath?` | `string` |
| `envFile?` | `string` |

#### Returns

`Promise`\<[`LotionConstructor`](types.md#lotionconstructor)\>

#### Defined in

[src/utils/config.ts:42](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/utils/config.ts#L42)

___

### getCosmicConfig

▸ **getCosmicConfig**(`configFilePath?`): `Promise`\<\{ `config`: `any` ; `filepath`: `string` ; `isEmpty?`: `boolean`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath?` | `string` |

#### Returns

`Promise`\<\{ `config`: `any` ; `filepath`: `string` ; `isEmpty?`: `boolean`  }\>

#### Defined in

[src/utils/config.ts:10](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/utils/config.ts#L10)
