import { defineType } from 'sanity';

const sale = defineType({
  name: 'sale',
  title: 'Sale',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Sale Date',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      readOnly: true,
    },
    {
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'saleType',
      title: 'Sale Type',
      type: 'string',
      options: {
        list: [
          { title: 'Jente', value: 'jente' },
          { title: 'Pneu', value: 'pneu' },
          { title: 'Mixte', value: 'mixte' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'object',
              fields: [
                {
                  name: 'oldProduct',
                  title: 'Old Product Name',
                  type: 'string',
                  hidden: true
                },
                {
                  name: 'newProduct',
                  title: 'Product',
                  type: 'reference',
                  to: [
                    { type: 'jente' },
                    { type: 'pneu' },
                    { type: 'mixt' }
                  ],
                  options: {
                    filter: ({ parent }: { parent: { parent: { parent: { saleType: string } } } }) => {
                      const saleType = parent?.parent?.parent?.saleType;
                      if (saleType === 'jente') return { filter: '_type == "jente"' };
                      if (saleType === 'pneu') return { filter: '_type == "pneu"' };
                      if (saleType === 'mixte') return { filter: '_type == "mixt"' };
                      return {};
                    }
                  }
                }
              ],
              preview: {
                select: {
                  title: 'newProduct.name',
                  subtitle: 'oldProduct'
                },
                prepare({ title, subtitle }) {
                  return {
                    title: title || subtitle || 'Product'
                  }
                }
              }
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            },
            {
              name: 'totalPrice',
              title: 'Total Price',
              type: 'number',
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    },
    {
      name: 'grandTotal',
      title: 'Grand Total',
      type: 'number',
      readOnly: true,
      description: 'Sum of all total prices in products',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Pending', value: 'pending' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
  ],
  initialValue: {
    status: 'pending',
    date: (new Date()).toISOString(),
  },
});

export default sale;
