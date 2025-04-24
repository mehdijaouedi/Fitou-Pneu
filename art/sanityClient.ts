// src/sanityClient.ts
import { createClient } from 'next-sanity'

// Basic client with minimal configuration
export const sanityClient = createClient({
  projectId: 'rsg8mxls',  
  dataset: 'production',  
  apiVersion: '2023-01-01',
  useCdn: false,         // Disable CDN to avoid caching issues
})

// Log connection attempt for debugging
console.log('Initializing Sanity client with projectId: rsg8mxls and dataset: production')

// Add a simple error handler for debugging
sanityClient.fetch(`*[_type == "pneu"][0...1]`)
  .then(data => {
    console.log('Sanity connection test successful', data)
  })
  .catch(err => {
    console.error('Sanity connection test failed:', err)
  })
