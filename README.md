# Sticky | Lotion

Sync a Notion database to a local place.

## Installation

```bash
npm install --save-dev git+https://github.com/sticky/sticky-utils-lotion#main
```

```bash
yarn add --dev git+https://github.com/sticky/sticky-utils-lotion#main
```

> Warning: this package will probably have a lot of breaking changes for a while you should probably use a specific commit hash in your _package.json_ instead of `#main` when installing.

## Usage

Add a script to your package.json.

```json
{
  "scripts": {
    "lotion": "sticky-utils-lotion"
  }
}
```

Add a _lotion.config.js_ file to your project that defines the way your Notion database will be synchronized locally.

## Configuration

The lotion.config.js file should be defined with the following properties.

<details>
<summary>Global properties</summary>

| Property | Type | Description |
| --- | --- | --- |
| envFile | string? | Path[^1] to a file that contains environment variables. Only needed if the database requires authentication, in which case, it should include a variable named `NOTION_TOKEN.` |
| outputFiles | string[] | An array of file paths[^1] to generate. Can be of type `json`, `js` or `ts`. |
| contentDir | string? | The directory[^1] to store downloaded files. This is only required if your input definitions contain a field of type `image`, `images`, `file`, or `files`. |
| import | ImportDefinition | An object that describes how to import the data. See below for details. |
| export | ExportDefinition | An object that describes how to export the data. See below for details. |
| logLevel | string? | The level of logging to output. Can be one of `none`, `normal`, `detailed`, or `debug`. Defaults to `normal`. |

[^1]: All path values are considered relative to the lotion.config.js location.
</details>

<details>
<summary>ImportDefinition</summary>

| Property | Type | Description |
| --- | --- | --- |
| database | string | The ID of the Notion database to sync. |
| fields | ImportFieldDefinition[] | An array of field definitions. See below for details. |
| schema | SchemaDefinition | An object that describes the final shape of the local data. See below for details. |
| postProcess | (schemaData: any) => Promise\<any\>? | An optional asynchronous function that can be used to transform the final data just before it is written to the output files. The `schemaData` argument takes the shape of the `schema` definition and includes any changes specified by `field`-level `validate` or `transform` functions. |
</details>

<details>
<summary>ExportDefinition</summary>

| Property | Type | Description |
| --- | --- | --- |
| database | string | The ID of the Notion database to sync. |
| fields | ExportFieldDefinition[] | An array of field definitions. See below for details. |
</details>

<details>
<summary>ImportFieldDefinition</summary>

| Property | Type | Description |
| --- | --- | --- |
| field | string | The name of the data column in Notion. It should match exactly. |
| type | TransformType | The expected type of data. Important for informing how the data is transformed. Can be one of `uuid`, `index`, `title`, `text`, `richText`, `number`, `boolean`, `files`, `file`, `images`, `image`, `options`, `option`, `relations`, `relation`. |
| default | any? | A default value to use if the field is empty. This is optional and will be set based on the `type` if not defined |
| transform | (value: any, originalRowData: any) => Promise\<any\>? | An optional asynchronous function that can be used apply a transformation to final shape of the particular field item. See below for more. |
| validate | (value: any, originalRowData: any) => Promise\<boolean\>? | An optional asynchronous function that can be used to validate the value of a field. If retunrning `false`, the item will be withheld from the final output. See below for more. |
</details>

<details>
<summary>ExportFieldDefinition</summary>

| Property | Type | Description |
| --- | --- | --- |
| field | string | The name of the data column in Notion. It should match exactly. |
| type | TransformType | The expected type of data. Important for informing how the data is transformed. Can be one of `uuid`, `title`, `text`, `richText`, `number`, `boolean`, `files`, `file`, `images`, `image`, `options`, `option`, `relations`, `relation`. |
| default | any? | A default value to use if the field is empty. This is optional and will be set based on the `type` if not defined |
| input | string | The name of the field in the `import.schema` definition that will be applied to this entry. |
</details>

<details>
<summary>TransformType</summary>

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| uuid | string | `''` | Use this type along with the field named `id` in order to use Notion's internal `id` for the row. |
| index | SchemaIndex | `{...}` | Notion's auto-incrementing custom IDs |
| title | string | `''` | Notion text or title fields. The result is always a plaintext `string`. Ideally this corresponds to Notion's internal title column. It is useful for identifying rows in Lotion's output logs, which would otherwise default to the Notion `id`. This should be set on 1 or fewer fields. |
| text | string | `''` | Notion text elements when you only want a `string` output of the plaintext. |
| richText | SchemaRichTextItem[] | `[]` | Notion text elements when you want to preserve the rich text data |
| number | number | `0` | Notion number elements. |
| boolean | boolean | `false` | Notion checkbox elements. |
| files | SchemaFile[] | `[]` | Notion file elements. |
| file | SchemaFile | `{...}` | Notion file elements. Same as `files`, but output is a single item |
| images | SchemaFile[] | `[]` | Notion file elements considered images `png` or `jp(e)g`. |
| image | SchemaFile | `{...}` | Notion file elements. Same as `images`, but output is a single item |
| options | string[] | `[]` | Notion multi-select elements. |
| option | string | `''` | Notion multi-select elements. Same as `options`, but output is a single `string` |
| relations | string[] | `[]` | Notion relation elements. Will be flattened to an array of Notion page `id` values |
| relation | string | `''` | Notion relation elements. Same as `relations`, but output is a single `id` |
</details>

<details>
<summary>SchemaIndex</summary>

| Property | Type |
| --- | --- |
| number | number |
| prefix | string/null |
| value | string |
</details>

<summary>SchemaRichTextItem</summary>

| Property | Type |
| --- | --- |
| text | string |
| href | string/null |
| annotations | SchemaRichTextAnnotations |
</details>

<details>
<summary>SchemaRichTextAnnotations</summary>

| Property | Type |
| --- | --- |
| bold | boolean |
| italic | boolean |
| strikethrough | boolean |
| underline | boolean |
| code | boolean |
| color | string/null |
</details>
<details>
<summary>SchemaFile</summary>

| Property | Type | Description |
| --- | --- | --- |
| path | string | The path to the file relative to the `contentDir` |
| name | string | The name of the file (without extension) |
| extension | string | The file extension |
| width | number | This will be `0` if not an image type |
| height | number | This will be `0` if not an image type |
</details>


### SchemaDefinition type

The schema definition can be an object of any shape, but the finally-nested value of any property should be a string that matches the value of a `field` from the `input.fields` array.

If you are adding fields into the schema that do not have corresponding columns from the Notion database, you should still create the `input` definition for it and provide a `default` value. The sync will ignore any fields that are not present in the Notion database and simply provide the `default` value.

> Recommendation: prefix the field names with an underscore to indicate that they are not present in the Notion database.

## Validation and Transformation

Syncing the Notion data happens in 4 main stages. These are listed here to insight into the order of operations in case your transformers or validators are not behaving as expected.

1. Fetch the data from Notion and flatten it into a useable raw format.
1. Validate the raw data and cancel processing any data that is invalid. This is where the `validate` functions are run.
1. Transform the validated data based on the `transform` functions.
1. Re-shape the transformed data based on the `schema` definition.

Both validate and transform functions are each passed 2 arguments containing lightly pre-processed data from Notion.

| Argument | Type | Description |
| --- | --- | --- |
| value | any | The value of the field from the Notion database. |
| originalRowData | any | The entire row of data from the Notion database. Access the data with the original `field` name, i.e. `originalRowData['My Notion Column']` |

The pre-processing is done to the row data before it is passed to these functions to make it easier to work with. For instance, an `image` value will be `SchemaFile` type instead of the raw Notion data. `option` values are flattened into a single string instead of an array of objects. This is true of the data presented in the `originalRowData` argument as well.

## Example

<details>
<summary>.env file</summary>

```.env
NOTION_TOKEN=secret_1234567890abcdef1234567890abcdef
```
</details>
<details>
<summary>lotion.config.js file</summary>

```js
module.exports = {
	envFile: './.env',
	contentDir: './public/content/images',
	outputFiles: [
		'./src/config/data.js',
		'./src/config/data.ts',
		'./backup/database.json',
	],
	input: {
		database: '1234567890abcdef1234567890abcdef',
		fields: [
			{
				field: 'id',
				type: 'uuid',
			},
			{
				field: 'Custom ID',
				type: 'index'
			},
			{
				field: 'Name',
				type: 'text',
				isPageTitle: true,
				default: 'Untitled',
			},
			{
				field: 'Description',
				type: 'richText',
				default: [],
			},
			{
				field: 'Image',
				type: 'image',
			},
			{
				field: 'Tags',
				type: 'options',
				transform: (value, originalRowData) => {
					return value.map((tag) => {
						return {
							name: tag.toLowerCase(),
							color: originalRowData['Value'] > 0 ? 'green' : 'red',
						}
					})
				},
			},
			{
				field: 'Value',
				type: 'number',
				default: 0,
			},
			{
				field: 'Files',
				type: 'files',
				default: [],
			},
			{
				field: 'Is Published',
				type: 'boolean',
				validate: (value) => {
					return value
				}
			},
			{
				field: '_project',
				type: 'text',
				default: 'Custom Project',
			},
		],
		schema: {
			id: 'id',
			title: 'Name',
			description: 'Description',
			image: 'Image',
			attachments: 'Files',
			metadata: {
				tags: 'Tags',
				value: 'Value',
				project: '_project',
			}
		}
	},
}
</details>