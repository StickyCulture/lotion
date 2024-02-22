# sticky-utils-lotion

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
    "lotion": "sticky-utils-lotion",
	 "lotion:media": "sticky-utils-lotion --config ./media.lotion.config.js",
	 "lotion:help": "sticky-utils-lotion --help",
  }
}
```

Default usage will search for a _lotion.config.js_ file relative to your project. You can also specify a configuration file with the `--config` option. You can also use the `--help` option to see the available options.

## Configuration

See the [API documentation](/docs/README.md) for more details and type definitions.

### Examples

The following example configuration pulls data from a Notion database filtering out items that are not published and have no description.

It uses an external script to create an alternate description for each item suitable for a 5th grader.

It writes the data to a TypeScript file in some application directory and a backup JSON file.

Finally, it exports the new description back to the same Notion database in a new column of the same row.

#### .env file

```sh
NOTION_IMPORT_TOKEN=secret_1234567890abcdef1234567890abcdef

# required if the export database is different than the import database
NOTION_EXPORT_TOKEN=secret_1234567890abcdef1234567890abcdef
```

#### lotion.config.js file


```js
const myCustomGptApi = require('./myCustomGptApi.js')

module.exports = {
	envFile: './.env',
	contentDir: './public/content/images',
	outputFiles: [
		'./src/data/output.ts',
		'./backup/database.json',
	],
	logLevel: 'detailed',
	import: {
		database: '1234567890abcdef1234567890abcdef',
		sorts: [{
			property: 'ID',
			direction: 'ascending'
		}],
		filter: {
			and: [
				{
					property: 'Description',
					rich_text: {
						is_not_empty: true
					}
				},
				{
					property: 'Omit',
					checkbox: {
						equals: false
					}
				}
			]
		},
		fields: [
			{
				field: 'id',
				type: 'uuid',
			},
			{
				field: 'ID',
				type: 'index'
			},
			{
				field: 'Name',
				type: 'title',
			},
			{
				field: 'Description',
				type: 'richText',
			},
			{
				field: 'Hero Image',
				type: 'image',
			},
			{
				field: 'Tags',
				type: 'options',
				transform: (value, row) => {
					return value.map((tag) => {
						return {
							name: tag.toLowerCase(),
							color: row['Value'] > 0 ? 'green' : 'red',
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
				field: 'Related Attachment Files',
				type: 'files',
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
			image: 'Hero Image',
			attachments: 'Related Attachment Files',
			metadata: {
				tags: 'Tags',
				value: 'Value',
				project: '_project',
			}
		},
		postProcess: async (data) => {
			const prompt = "Rewrite the following description in plain language that a 5th grader could understand:"
			for (const item of data) {
				item.description_g5 = await myCustomGptApi(prompt, item.description)
			}
			return data
		},
		export: {
			database: '1234567890abcdef1234567890abcdef',
			fields: [
				{
					field: 'id',
					type: 'uuid',
					input: 'id',
				},
				{
					field: '5th Grade Description',
					type: 'richText',
					input: 'description',
				},
			],
		}
	},
}