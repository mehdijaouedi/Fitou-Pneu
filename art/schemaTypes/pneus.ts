import { defineType } from 'sanity';
import React from 'react';

const pneu = defineType({
  name: 'pneu',
  title: 'Pneu',
  type: 'document',
  fields: [
    // Excel file upload field
    {
      name: 'excelFile',
      title: 'Upload Excel File',
      type: 'string',
      description: 'Upload your Excel file to view all data one by one',
      components: {
        input: React.lazy(() => import('../components/ExcelFileUpload'))
      }
    },
    
    // Basic product information
    { 
      name: 'name', 
      title: 'Pneu Name', 
      type: 'string'
    },
    { 
      name: 'brand',
      title: 'Brand',
      type: 'string'
    },
    { 
      name: 'model',
      title: 'Model',
      type: 'string'
    },
    
    // Excel spreadsheet fields
    {
      name: 'ean',
      title: 'EAN',
      type: 'string'
    },
    {
      name: 'sap',
      title: 'SAP',
      type: 'string'
    },
    {
      name: 'itemNo',
      title: 'ITEM NO.',
      type: 'string'
    },
    {
      name: 'size',
      title: 'SIZE',
      type: 'reference',
      to: [{ type: 'tireSize' }],
      options: {
        disableNew: false,
      },
      description: 'Choose a size or create a new size document',
    },
    {
      name: 'liSi',
      title: 'LI/SI',
      type: 'string'
    },
        
    {
      name: 'eprelCode',
      title: 'EPREL CODE',
      type: 'string'
    },
    {
      name: 'rr',
      title: 'RR',
      type: 'string'
    },
    {
      name: 'wg',
      title: 'WG',
      type: 'string'
    },
    {
      name: 'soundClass',
      title: 'SOUND CLASS',
      type: 'string'
    },
    {
      name: 'soundDb',
      title: 'SOUND DB',
      type: 'number'
    },
    
    {
      name: 'season',
      title: 'Season',
      type: 'string',
      options: {
        list: [
          { title: 'Summer', value: 'summer' },
          { title: 'Winter', value: 'winter' },
          { title: '4-Season', value: '4season' }
        ]
      },
      description: 'Select the season type for this tire'
    },
    {
      name: 'qty40hc',
      title: 'QTY /40\'HC',
      type: 'number'
    },
    
    // Pricing fields
    {
      name: 'buyPrice',
      title: 'Buy Price (€)',
      type: 'number'
    },
    {
      name: 'sellPrice',
      title: 'Sell Price (€)',
      type: 'number'
    },
    {
      name: 'sellPriceNord',
      title: 'Sell Price Nord (€)',
      type: 'number',
      description: 'Selling price for the Nord region'
    },
    
    // Promotion field
    {
      name: 'isPromotion',
      title: 'Promotion Mode',
      type: 'boolean',
      description: 'Mark this product as promotional',
      initialValue: false
    },
    
    // Timestamps
    { 
      name: 'dateAdded', 
      title: 'Date Added', 
      type: 'datetime'
    },
    { 
      name: 'lastUpdated', 
      title: 'Last Updated', 
      type: 'datetime'
    }
  ],
  preview: {
    select: { 
      title: 'name',
      subtitle: 'brand',
      sizeTitle: 'size.title',
      sellPrice: 'sellPrice',
      sellPriceNord: 'sellPriceNord'
    },
    prepare({ title, subtitle, sizeTitle, sellPrice, sellPriceNord }) {
      const priceInfo = sellPriceNord ? `€${sellPrice || 0} / Nord: €${sellPriceNord}` : `€${sellPrice || 0}`;
      return { 
        title: title || 'New Pneu',
        subtitle: `${subtitle || ''} ${sizeTitle || ''} - ${priceInfo}`
      };
    },
  },
});

export default pneu;
