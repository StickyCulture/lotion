[sticky-utils-lotion](../README.md) / [types](../modules/types.md) / LotionConfig

# Interface: LotionConfig

[types](../modules/types.md).LotionConfig

The configuration object expected by the CLI when defined in a lotion.config.js file.

## Table of contents

### Properties

- [contentDir](types.LotionConfig.md#contentdir)
- [envFile](types.LotionConfig.md#envfile)
- [export](types.LotionConfig.md#export)
- [import](types.LotionConfig.md#import)
- [logLevel](types.LotionConfig.md#loglevel)
- [outputFiles](types.LotionConfig.md#outputfiles)

## Properties

### contentDir

• `Optional` **contentDir**: `string`

Path to the directory where imported Files and Media will be saved

#### Defined in

[src/types.ts:268](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L268)

___

### envFile

• `Optional` **envFile**: `string`

Path to a `.env` file to load environment variables from

#### Defined in

[src/types.ts:264](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L264)

___

### export

• `Optional` **export**: [`LotionExport`](types.LotionExport.md)

#### Defined in

[src/types.ts:282](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L282)

___

### import

• **import**: [`LotionImport`](types.LotionImport.md)

#### Defined in

[src/types.ts:281](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L281)

___

### logLevel

• `Optional` **logLevel**: [`LotionLogLevel`](../enums/types.LotionLogLevel.md)

Logging level to use for the application

#### Defined in

[src/types.ts:280](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L280)

___

### outputFiles

• **outputFiles**: `string`[]

Paths to output files that will be generated.

Filenames must either end in __.json__, __.js__, or __.ts__ in order to be output.

Value may be the special keyword `memory` to prevent writing to disk. Result will be an array returned from the `Lotion().run` function.

#### Defined in

[src/types.ts:276](https://github.com/sticky/sticky-utils-lotion/blob/b4b9358/src/types.ts#L276)
