import { defineType } from 'sanity';

const mixt = defineType({
  name: 'mixt',
  title: 'Mixt',
  type: 'document',
  fields: [
    { name: 'dateAdded', title: 'Date Added', type: 'datetime' },
    { name: 'name', title: 'mixt Name', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'quantity', title: 'Quantity', type: 'number' },
    { name: 'reference', title: 'Reference', type: 'string' },

    {
      name: 'fournisseur',
      title: 'Fournisseur',
      type: 'reference',
      to: [{ type: 'fournisseur' }], 
    },
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [{ type: 'reference', to: [{ type: 'media' }] }],
    },
  ],
});

export default mixt;
