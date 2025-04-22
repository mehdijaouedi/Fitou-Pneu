import { defineType } from 'sanity'

export default defineType({
  name: 'fournisseur',
  title: 'Fournisseur',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'contact', title: 'Contact Info', type: 'string' },
  ],
})
