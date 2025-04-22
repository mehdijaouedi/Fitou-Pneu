// src/sanityClient.ts
import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'rsg8mxls',       // Your Sanity project ID
  dataset: 'production',       // Your dataset
  apiVersion: '2023-01-01',    // Use a fixed date (format: YYYY-MM-DD)
  useCdn: true,                // `true` for fast but cached data
})
