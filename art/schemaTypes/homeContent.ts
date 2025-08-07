import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homeContent',
  title: 'Home Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The main title for the content box',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: Rule => Rule.required(),
      description: 'The main content text that will be displayed',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'CSS color value (e.g., #f5f5f5, #1976d2, red, etc.)',
      initialValue: '#f5f5f5',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'CSS color value (e.g., #333, white, black, etc.)',
      initialValue: '#333',
    })
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
    },
    prepare(selection) {
      const { title, content } = selection;
      return {
        title: title || 'Untitled',
        subtitle: content ? content.substring(0, 40) + '...' : '',
      };
    },
  },
}); 