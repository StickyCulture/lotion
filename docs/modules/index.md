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

▸ **generateParamsFromConfigFile**(`configFilePath?`, `environmentOptions?`): `Promise`\<[`LotionConstructor`](types.md#lotionconstructor)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath?` | `string` |
| `environmentOptions?` | [`EnvironmentOptions`](../interfaces/types.EnvironmentOptions.md) |

#### Returns

`Promise`\<[`LotionConstructor`](types.md#lotionconstructor)\>

#### Defined in

[src/utils/config.ts:42](https://github.com/sticky/sticky-utils-lotion/blob/6919cf3/src/utils/config.ts#L42)

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

[src/utils/config.ts:10](https://github.com/sticky/sticky-utils-lotion/blob/6919cf3/src/utils/config.ts#L10)
