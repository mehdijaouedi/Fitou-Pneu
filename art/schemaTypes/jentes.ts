import { defineType } from 'sanity';

const jente = defineType({
  name: 'jente',
  title: 'jente',
  type: 'document',
  fields: [
    { name: 'dateAdded', title: 'Date Added', type: 'datetime' },
    { name: 'name', title: 'jente Name', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'quantity', title: 'Quantity', type: 'number' },
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [{ type: 'reference', to: [{ type: 'media' }] }],
    },
  ],
});

export default jente;
