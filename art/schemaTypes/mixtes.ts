import { defineType } from 'sanity';

const mixt = defineType({
  name: 'mixt',
  title: 'Mixt',
  type: 'document',
  fields: [
    { name: 'dateAdded', title: 'Date Added', type: 'datetime' },
    { name: 'client', title: 'Client', type: 'reference', to: [{ type: 'client' }] },
    { name: 'fournisseur', title: 'Fournisseur', type: 'reference', to: [{ type: 'fournisseur' }] },
    { name: 'quantity', title: 'Quantity', type: 'number' },
  ],
});

export default mixt;
