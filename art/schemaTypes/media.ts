export default {
    name: 'media',
    type: 'document',
    title: 'Media',
    fields: [
      {
        name: 'dbId',
        type: 'string',
        title: 'Database ID',
      },
      {
        name: 'path',
        type: 'string',
        title: 'Path',
      },
      {
        name: 'type',
        type: 'string',
        title: 'Type',
      },
      {
        name: 'alt',
        type: 'string',
        title: 'Alt Text',
      },
      {
        name: 'extension',
        type: 'string',
        title: 'Extension',
      },
      {
        name: 'description',
        type: 'text',
        title: 'Description',
      },
      {
        name: 'file',
        type: 'image',
        title: 'File',
        options: {
          accept: 'image/*',
      },
    },
  ],
  }