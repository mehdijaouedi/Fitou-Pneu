import { defineType } from 'sanity'

export default defineType({
  name: 'fournisseur',
  title: 'Fournisseur',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'phoneNumber', title: 'Phone Number', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    },
    // Reference to related 'jente' documents
    {
      name: 'relatedProducts', // Field name
      title: 'Related Products', // Title
      type: 'array', // We are allowing multiple references
      of: [{ type: 'reference', to: [{ type: 'jente' }] }], // Reference to 'jente' document
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      media: 'image',
    },
  },
})
