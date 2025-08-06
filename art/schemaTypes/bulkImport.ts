import { defineType } from 'sanity';

const bulkImport = defineType({
  name: 'bulkImport',
  title: 'Bulk Import Pneus',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Import Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'excelData',
      title: 'Excel Data (CSV format)',
      type: 'text',
      description: 'Paste your Excel data here in CSV format. Make sure the columns are: EAN,SAP,ITEM NO.,SIZE,LI/SI,Extra,Pattern,EPREL CODE,RR,WG,SOUND CLASS,SOUND DB,CAT,QTY /40\'HC,Price. After pasting, use the population script to process the data.',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Import Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'importDate',
      title: 'Import Date',
      type: 'datetime',
      readOnly: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      importDate: 'importDate'
    },
    prepare({ title, status, importDate }) {
      return {
        title: title || 'Bulk Import',
        subtitle: `${status || 'pending'} - ${importDate ? new Date(importDate).toLocaleDateString() : 'Not imported'}`
      };
    },
  },
});

export default bulkImport; 