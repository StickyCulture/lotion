# Lotion

Sync a Notion database to a local place. Lotion is a command line tool, configuration file and API for simplifying the process of importing and exporting data from Notion.

You can use it to pull data from a Notion database, filter, transform and write it to a local file. You can also use it to write data back to a Notion database.

The goal is to abstract the complexity of the Notion API and providing a simple interface for getting exactly the data you want in exactly the format you need.

## Installation

```bash
npm install --save-dev git+https://github.com/StickyCulture/lotion#main
```

```bash
yarn add --dev git+https://github.com/StickyCulture/lotion#main
```

> Warning: this package will probably have a lot of breaking changes for a while you should probably use a specific commit hash in your _package.json_ instead of `#main` when installing.

## Usage

Add a script to your package.json.

```json
{
  "scripts": {
    "lotion": "lotion",
    "lotion:media": "lotion --config ./media.lotion.js",
    "lotion:help": "lotion --help"
  },
  "devDependencies": {
    "@stickyculture/lotion": "git+https://github.com/StickyCulture/lotion#123456"
  }
}
```

Default usage will search for a _lotion.config.js_ file relative to your project. You can also specify a configuration file with the `--config` option. You can also use the `--help` option to see the available options.

## Configuration

See the [API documentation](/docs/README.md) for more details and type definitions.

### Examples

The following example configuration pulls data from a Notion database filtering out items that are not published and have no description.

It uses an external script (not described here) to create an alternate description for each item suitable for a 5th grader.

It writes the data to a TypeScript file in some application directory and a backup JSON file.

Finally, it exports the new description back to the same Notion database in a new column of the same row.

#### .env file

```sh
NOTION_IMPORT_TOKEN=secret_1234567890abcdef1234567890abcdef

# required if the export database is different than the import database
NOTION_EXPORT_TOKEN=secret_1234567890abcdef1234567890abcdef
```

> Note: You can also pass `--notion-import-token` and `--notion-export-token` as command line options.

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
        name: 'id',
        type: 'uuid',
      },
      {
        name: 'ID',
        type: 'index'
      },
      {
        name: 'Name',
        type: 'title',
      },
      {
        name: 'Description',
        type: 'richText',
      },
      {
        name: 'Hero Image',
        type: 'image',
      },
      {
        name: 'Tags',
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
        name: 'Value',
        type: 'number',
        default: 0,
      },
      {
        name: 'Related Attachment Files',
        type: 'files',
      },
      {
        name: 'Is Published',
        type: 'boolean',
        validate: (value) => {
          return value
        }
      },
      {
        name: '_project',
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
        const plaintextDescription = item.description.map((richtext) => richtext.text).join('')
        // the final schema will now include `description_g5` property
        item.description_g5 = await myCustomGptApi(prompt, plaintextDescription)
      }
      return data
    },
    export: {
      database: '1234567890abcdef1234567890abcdef',
      fields: [
        {
          name: 'id',
          type: 'uuid',
          input: 'id',
        },
        {
          // Note: the '5th Grade Description' column is expected to already exist in the Notion database
          name: '5th Grade Description',
          type: 'text',
          input: 'description_g5',
        },
      ],
    }
  },
}