import { defineType } from 'sanity'

export default defineType({
  name: 'fournisseur',
  title: 'Fournisseur',
  type: 'document',
  fields: [
    { 
      name: 'name', 
      title: 'Name', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'phoneNumber', 
      title: 'Phone Number', 
      type: 'string',
      validation: Rule => Rule.required().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    },
    { 
      name: 'email', 
      title: 'Email', 
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    { 
      name: 'location', 
      title: 'Location', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'address',
      title: 'Full Address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'country', type: 'string', title: 'Country' }
      ]
    },
    {
      name: 'businessInfo',
      title: 'Business Information',
      type: 'object',
      fields: [
        { name: 'registrationNumber', type: 'string', title: 'Registration Number' },
        { name: 'taxId', type: 'string', title: 'Tax ID' },
        { name: 'vatNumber', type: 'string', title: 'VAT Number' }
      ]
    },
    {
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'position', type: 'string', title: 'Position' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'email', type: 'string', title: 'Email' }
      ]
    },
    {
      name: 'paymentTerms',
      title: 'Payment Terms',
      type: 'object',
      fields: [
        { name: 'creditLimit', type: 'number', title: 'Credit Limit' },
        { name: 'paymentDays', type: 'number', title: 'Payment Days' },
        { name: 'currency', type: 'string', title: 'Currency' }
      ]
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'string', title: 'Day' },
            { name: 'open', type: 'string', title: 'Opening Time' },
            { name: 'close', type: 'string', title: 'Closing Time' }
          ]
        }
      ]
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [
        { 
          type: 'reference', 
          to: [
            { type: 'jente' },
            { type: 'pneu' }
          ] 
        }
      ]
    },
    {
      name: 'orderHistory',
      title: 'Order History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'orderDate', type: 'datetime', title: 'Order Date' },
            { name: 'orderNumber', type: 'string', title: 'Order Number' },
            { name: 'amount', type: 'number', title: 'Amount' },
            { name: 'status', type: 'string', title: 'Status' }
          ]
        }
      ]
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'companyName',
      media: 'image'
    }
  }
})
