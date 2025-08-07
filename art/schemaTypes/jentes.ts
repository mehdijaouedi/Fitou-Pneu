import { defineType } from 'sanity';

const jente = defineType({
  name: 'jente',
  title: 'Jente',
  type: 'document',
  fields: [
    { 
      name: 'dateAdded', 
      title: 'Date Added', 
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    { 
      name: 'lastUpdated', 
      title: 'Last Updated', 
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    { 
      name: 'name', 
      title: 'Jente Name', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'description', 
      title: 'Description', 
      type: 'text'
    },
    { 
      name: 'brand',
      title: 'Brand',
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'purchasePrice', 
      title: 'Purchase Price', 
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    { 
      name: 'sellingPrice', 
      title: 'Selling Price (Nord France)', 
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    { 
      name: 'nordPrice', 
      title: 'Price for Nord France', 
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    { 
      name: 'sudPrice', 
      title: 'Price for Sud France', 
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    { 
      name: 'quantity', 
      title: 'Quantity', 
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    { 
      name: 'unit', 
      title: 'Unit', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'minStockLevel', 
      title: 'Minimum Stock Level', 
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    { 
      name: 'reference', 
      title: 'Reference', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'rimSpecs',
      title: 'Rim Specifications',
      type: 'object',
      fields: [
        {
          name: 'diameter',
          title: 'Diameter (inches)',
          type: 'number',
          options: {
            list: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'width',
          title: 'Width (J)',
          type: 'number',
          options: {
            list: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'offset',
          title: 'Offset (ET)',
          type: 'number',
          options: {
            list: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'boltPattern',
          title: 'Bolt Pattern',
          type: 'string',
          options: {
            list: [
              { title: '4x100', value: '4x100' },
              { title: '4x108', value: '4x108' },
              { title: '4x114.3', value: '4x114.3' },
              { title: '5x100', value: '5x100' },
              { title: '5x108', value: '5x108' },
              { title: '5x112', value: '5x112' },
              { title: '5x114.3', value: '5x114.3' },
              { title: '5x120', value: '5x120' },
              { title: '5x130', value: '5x130' },
              { title: '6x139.7', value: '6x139.7' }
            ]
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'centerBore',
          title: 'Center Bore (mm)',
          type: 'number',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'material',
      title: 'Material',
      type: 'string',
      options: {
        list: [
          { title: 'Aluminum', value: 'aluminum' },
          { title: 'Steel', value: 'steel' },
          { title: 'Forged Aluminum', value: 'forged_aluminum' },
          { title: 'Carbon Fiber', value: 'carbon_fiber' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'finish',
      title: 'Finish Type',
      type: 'string',
      options: {
        list: [
          { title: 'Chrome', value: 'chrome' },
          { title: 'Matte Black', value: 'matte_black' },
          { title: 'Gloss Black', value: 'gloss_black' },
          { title: 'Silver', value: 'silver' },
          { title: 'Gold', value: 'gold' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Gunmetal', value: 'gunmetal' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'weight',
      title: 'Weight (kg)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'loadCapacity',
      title: 'Load Capacity (kg)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'manufacturingDate',
      title: 'Manufacturing Date',
      type: 'date'
    },
    {
      name: 'warranty',
      title: 'Warranty Information',
      type: 'object',
      fields: [
        { name: 'duration', type: 'number', title: 'Duration (months)' },
        { name: 'conditions', type: 'text', title: 'Conditions' }
      ]
    },
    {
      name: 'compatibleTires',
      title: 'Compatible Tire Sizes',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Out of Stock', value: 'out_of_stock' },
          { title: 'Discontinued', value: 'discontinued' },
          { title: 'On Order', value: 'on_order' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'fournisseur',
      title: 'Fournisseur',
      type: 'reference',
      to: [{ type: 'fournisseur' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [{ type: 'reference', to: [{ type: 'media' }] }],
      validation: Rule => Rule.required().min(1)
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
  preview: {
    select: { 
      title: 'name',
      subtitle: 'rimSpecs.diameter',
      media: 'images.0'
    },
    prepare({ title, subtitle, media }) {
      return { 
        title,
        subtitle: subtitle ? `${subtitle}" Rim` : '',
        media
      };
    },
  },
});

export default jente;    
