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

See the [API documentation](/docs/README.md) for details about configuration.

<details>
<summary>.env file</summary>

```sh
NOTION_IMPORT_TOKEN=secret_1234567890abcdef1234567890abcdef

# required if the export database is different than the import database
NOTION_EXPORT_TOKEN=secret_1234567890abcdef1234567890abcdef
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