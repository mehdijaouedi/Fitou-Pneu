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
      type: 'string',
      options: {
        list: [
          { title: '155/70R12', value: '155/70R12' },
          { title: '145/80R12', value: '145/80R12' },
          { title: '155/80R12', value: '155/80R12' },
          { title: '165/70R12', value: '165/70R12' },
          { title: '175/70R12', value: '175/70R12' },
          { title: '145/80R13', value: '145/80R13' },
          { title: '155/80R13', value: '155/80R13' },
          { title: '165/80R13', value: '165/80R13' },
          { title: '175/80R13', value: '175/80R13' },
          { title: '185/80R13', value: '185/80R13' },
          { title: '155/70R13', value: '155/70R13' },
          { title: '165/70R13', value: '165/70R13' },
          { title: '175/70R13', value: '175/70R13' },
          { title: '185/70R13', value: '185/70R13' },
          { title: '195/70R13', value: '195/70R13' },
          { title: '205/70R13', value: '205/70R13' },
          { title: '165/65R14', value: '165/65R14' }
        ]
      }
    },
    {
      name: 'liSi',
      title: 'LI/SI',
      type: 'string'
    },
    {
      name: 'extra',
      title: 'Extra',
      type: 'string'
    },
    {
      name: 'pattern',
      title: 'Pattern',
      type: 'string',
      options: {
        list: [
          { title: 'BLAZER HP', value: 'BLAZER HP' }
        ]
      }
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
      name: 'cat',
      title: 'CAT',
      type: 'string'
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
      size: 'size',
      sellPrice: 'sellPrice'
    },
    prepare({ title, subtitle, size, sellPrice }) {
      return { 
        title: title || 'New Pneu',
        subtitle: `${subtitle || ''} ${size || ''} - €${sellPrice || 0}`
      };
    },
  },
});

export default pneu;
