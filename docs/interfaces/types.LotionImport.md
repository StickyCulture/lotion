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

The Notion database ID to query

#### Defined in

[src/types.ts:208](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L208)

___

### fields

• **fields**: [`LotionField`](types.LotionField.md)[]

An array of field definitions to import from the Notion API response

#### Defined in

[src/types.ts:228](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L228)

___

### filters

• `Optional` **filters**: `PropertyFilter` \| `TimestampCreatedTimeFilter` \| `TimestampLastEditedTimeFilter` \| \{ `or`: PropertyFilter \| TimestampCreatedTimeFilter \| TimestampLastEditedTimeFilter \| \{ or: PropertyFilter[]; } \| \{ ...; }[]  } \| \{ `and`: PropertyFilter \| TimestampCreatedTimeFilter \| TimestampLastEditedTimeFilter \| \{ or: PropertyFilter[]; } \| \{ ...; }[]  }

Filter arguments for the query, see [Notion API documentation](https://developers.notion.com/reference/post-database-query) for more information

#### Defined in

[src/types.ts:212](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L212)

___

### limit

• `Optional` **limit**: `number`

The maximum number of records to return

#### Defined in

[src/types.ts:220](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L220)

___

### offset

• `Optional` **offset**: `number`

The number of records to skip before returning results. Will operate on the default Notion sort order unless a custom `sorts` array is provided.

#### Defined in

[src/types.ts:224](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L224)

___

### postProcess

• `Optional` **postProcess**: (`data`: `any`[]) => `Promise`\<`any`[]\>

A hook function that runs immediately after all imported rows have been processed with `transform` and `validate` functions and just before the final export and write to output files. This function should return the final array of data to be exported.

**`Param`**

The array of data that has been processed

#### Type declaration

▸ (`data`): `Promise`\<`any`[]\>

A hook function that runs immediately after all imported rows have been processed with `transform` and `validate` functions and just before the final export and write to output files. This function should return the final array of data to be exported.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any`[] | The array of data that has been processed |

##### Returns

`Promise`\<`any`[]\>

A promise that resolves with the final array of data to be exported

#### Defined in

[src/types.ts:258](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L258)

___

### schema

• **schema**: `Object`

A object describing your desired output schema for the importd data. Values may be either a `string` that matches a field name from the `fields` array or an object that describes a nested schema.

If you are adding fields into the schema that do not have corresponding columns from the Notion database, you should still create the `LotionField` definition for it and provide a `default` value. The sync will ignore any fields that are not present in the Notion database and simply provide the `default` value.

**`Example`**

```javascript
fields: [
   { field: 'My Notion Title', type: 'title' },
   { field: 'My Rich Text Field', type: 'richText' },
   { field: 'My Images', type: 'images' },
   { field: '_not_in_the_database', type: 'number', default: Math.random() }
],
schema: {
   title: 'My Notion Title',
   body: {
      text: 'My Rich Text Field',
      images: 'My Images',
   },
  randomNumber: '_not_in_the_database'
}
```

#### Index signature

▪ [key: `string`]: `string` \| `object`

#### Defined in

[src/types.ts:252](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L252)

___

### sorts

• `Optional` **sorts**: (\{ `direction`: ``"ascending"`` \| ``"descending"`` ; `property`: `string`  } \| \{ `direction`: ``"ascending"`` \| ``"descending"`` ; `timestamp`: ``"created_time"`` \| ``"last_edited_time"``  })[]

Sort arguments for the query, see [Notion API documentation](https://developers.notion.com/reference/post-database-query) for more information

#### Defined in

[src/types.ts:216](https://github.com/sticky/sticky-utils-lotion/blob/d94a83a/src/types.ts#L216)
