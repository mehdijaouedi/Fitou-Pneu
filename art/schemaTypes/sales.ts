import { defineType } from 'sanity';

const sale = defineType({
  name: 'sale',
  title: 'Sale',
  type: 'document',
  fields: [
    { name: 'date', title: 'Sale Date', type: 'datetime' },
    { name: 'client', title: 'Client', type: 'reference', to: [{ type: 'client' }] },
    { name: 'products', title: 'Products', type: 'array', of: [
      {
        type: 'object',
        fields: [
          { name: 'productType', title: 'Product Type', type: 'string', options: {
            list: [
              { title: 'Pneu', value: 'pneu' },
              { title: 'Jente', value: 'jente' },
              { title: 'Mixt', value: 'mixt' }
            ]
          }},
          { name: 'product', title: 'Product', type: 'reference', to: [
            { type: 'pneu' },
            { type: 'jente' },
            { type: 'mixt' }
          ]},
          { name: 'quantity', title: 'Quantity', type: 'number' },
          { name: 'price', title: 'Price', type: 'number' }
        ]
      }
    ]},
    { name: 'totalAmount', title: 'Total Amount', type: 'number' },
    { name: 'status', title: 'Status', type: 'string', options: {
      list: [
        { title: 'Completed', value: 'completed' },
        { title: 'Pending', value: 'pending' },
        { title: 'Cancelled', value: 'cancelled' }
      ]
    }}
  ],
});

export default sale; 