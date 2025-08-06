import { defineType } from 'sanity'

export default defineType({
  name: 'media',
  type: 'document',
  title: 'Media',
  fields: [
    {
      name: 'dbId',
      type: 'string',
      title: 'Database ID',
      validation: Rule => Rule.required()
    },
    {
      name: 'path',
      type: 'string',
      title: 'Path',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Document', value: 'document' },
          { title: 'Video', value: 'video' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      validation: Rule => Rule.required()
    },
    {
      name: 'extension',
      type: 'string',
      title: 'Extension',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description'
    },
    {
      name: 'file',
      type: 'image',
      title: 'File',
      options: {
        accept: 'image/*',
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'dimensions',
      title: 'Image Dimensions',
      type: 'object',
      fields: [
        { name: 'width', type: 'number', title: 'Width' },
        { name: 'height', type: 'number', title: 'Height' }
      ]
    },
    {
      name: 'fileSize',
      title: 'File Size (KB)',
      type: 'number'
    },
    {
      name: 'optimizationSettings',
      title: 'Optimization Settings',
      type: 'object',
      fields: [
        { name: 'quality', type: 'number', title: 'Quality (0-100)' },
        { name: 'format', type: 'string', title: 'Format' }
      ]
    },
    {
      name: 'usage',
      title: 'Usage Tracking',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'datetime', title: 'Date Used' },
            { name: 'location', type: 'string', title: 'Where Used' }
          ]
        }
      ]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'type',
      media: 'file'
    }
  }
})