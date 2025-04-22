import { defineType } from 'sanity';

const pneu = defineType({
  name: 'pneu',
  title: 'Pneu',
  type: 'document',
  fields: [
    { name: 'dateAdded', title: 'Date Added', type: 'datetime' },
    { name: 'client', title: 'Client', type: 'reference', to: [{ type: 'client' }] },
    { name: 'fournisseur', title: 'Fournisseur', type: 'reference', to: [{ type: 'fournisseur' }] },
    { name: 'quantity', title: 'Quantity', type: 'number' },
    // add more fields as needed
  ],
});

export default pneu;
