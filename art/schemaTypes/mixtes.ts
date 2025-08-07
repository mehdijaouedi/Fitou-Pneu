import { defineType } from 'sanity';

const mixt = defineType({
  name: 'mixt',
  title: 'Mixt',
  type: 'document',
  fields: [
    { name: 'dateAdded', title: 'Date Added', type: 'datetime' },
    { name: 'name', title: 'mixt Name', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price (Nord France)', type: 'number' },
    { name: 'nordPrice', title: 'Price for Nord France', type: 'number' },
    { name: 'sudPrice', title: 'Price for Sud France', type: 'number' },
    { name: 'purchasePrice', title: 'Purchase Price', type: 'number' },
    { name: 'sellingPrice', title: 'Selling Price', type: 'number' },
    { name: 'quantity', title: 'Quantity', type: 'number' },
    { name: 'reference', title: 'Reference', type: 'string' },
        { name: 'size', title: 'size', type: 'string' },

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
    {
      name: 'isPromotion',
      title: 'Is Promotion',
      type: 'boolean',
      description: 'Mark this product as a promotional item',
      initialValue: false
    },
    {
      name: 'promotionDiscount',
      title: 'Promotion Discount (%)',
      type: 'number',
      description: 'Discount percentage for promotional items',
      validation: Rule => Rule.min(0).max(100),
      hidden: ({ document }) => !document?.isPromotion
    }
  ],
});

export default mixt;
