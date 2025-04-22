import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { dashboardTool } from '@sanity/dashboard' // ✅ Import the real plugin
import { schemaTypes } from './schemaTypes'
import ProductStatsWidget from '../art/Widget/ProductStatsWidget'
// ...


export default defineConfig({
  name: 'fitou',
  title: 'fitou pneus',

  projectId: 'rsg8mxls',
  dataset: 'production',

  plugins: [
    deskTool(),
    dashboardTool({
      widgets: [
        {
          name: 'product-stats',
          component: ProductStatsWidget,
        },
      ],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
