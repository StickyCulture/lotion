# Sticky | Lotion

Sync a Notion database to a local project.

## Installation

```bash
npm install --save-dev github:sticky/sticky-utils-lotion
```

```bash
yarn add --dev github:sticky/sticky-utils-lotion
```

## Usage

Add a script to your package.json.

```json
{
  "scripts": {
	"lotion": "node ./node_modules/sticky-utils-lotion/index.js"
  }
}
```

Add a _lotion.config.js_ file to your project that defines the way your Notion database will be synchronized locally.

## Configuration

The lotion.config.js file should be defined with the following properties.

| Property | Type | Description |
| --- | --- | --- |
| envFile | string? | Path[^1] to a file that contains environment variables. Only needed if the database requires authentication, in which case, it should include a variable named `NOTION_TOKEN.` |
| database | string | The ID of the Notion database to sync. |
| outputFiles | string[] | An array of file paths[^1] to generate. Can be of type `json`, `js` or `ts`. |
| contentDir | string? | The directory[^1] to store downloaded files. This is only required if your input definitions contain a field of type `image`, `images`, `file`, or `files`. |
| input | InputDefinition[] | An array of input definitions. [See below for details.](#inputdefinition-type) |
| schema | SchemaDefinition | An object that describes the final shape of the local data. [See below for details.](#schemadefinition-type) |

[^1]: All path values are considered relative to the lotion.config.js location.

### InputDefinition type

| Property | Type | Description |
| --- | --- | --- |
| field | string | The name of the data column in Notion. It should match exactly. |
| type | string | The expected type of data. Important for informing how the data is transformed. Can be one of `uuid`, `text`, `richText`, `number`, `boolean`, `files`, `file`, `images`, `image`, `options`, `option`. |
| default | any? | A default value to use if the field is empty. This is optional and will be set based on the `type` if not defined |
| transform | (value: any, originalRowData: any) => any? | An optional function that can be used apply a transformation to final shape of the particular field item. See below for more. |
| validate | (value: any, originalRowData: any) => boolean? | An optional function that can be used to validate the value of a field. If retunrning `false`, the item will be withheld from the final output. See below for more. |
| isPageTitle | boolean? | Set this to `true` if the field refers to the column that Notion uses internally for the page title. This should be set on exactly 1 field. |

### SchemaDefinition type

The schema definition can be an object of any shape, but the finally-nested value of any property should be a string that matches the value of a `field` from the `input` array.

If you are adding fields into the schema that do not have corresponding columns from the Notion database, you should still create the `input` definition for it and provide a `default` value. The sync will ignore any fields that are not present in the Notion database and simply provide the `default` value.

> Recommendation: prefix the field names with an underscore to indicate that they are not present in the Notion database.

## Validation and Transformation

Syncing the Notion data happens in 4 main stages. These are listed here to insight into the order of operations in case your transformers or validators are not behaving as expected.

1. Fetch the data from Notion and flatten it into a useable raw format.
1. Validate the raw data and cancel processing any data that is invalid. This is where the `validate` functions are run.
1. Transform the validated data based on the `transform` functions.
1. Re-shape the transformed data based on the `schema` definition.

## Example

_.env_
```.env
NOTION_TOKEN=secret_1234567890abcdef1234567890abcdef
```

_lotion.config.js_
```js

module.exports = {
	envFile: './.env',
	database: '1234567890abcdef1234567890abcdef',
	contentDir: './public/content/images',
	outputFiles: [
		'./src/config/data.js',
		'./src/config/data.ts',
		'./backup/database.json',
	],
	input: [
		{
			field: 'id',
			type: 'uuid',
		}
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
			default: [],
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
}