#!/usr/bin/env node

// Simple runner for the populate script
console.log('🚀 Starting Pneus Population Script...');
console.log('📋 This will delete all existing pneus and add new data from Excel spreadsheet');
console.log('');

// Check if SANITY_TOKEN is set
if (!process.env.SANITY_TOKEN) {
  console.error('❌ Error: SANITY_TOKEN environment variable is not set');
  console.log('');
  console.log('Please set your Sanity token:');
  console.log('export SANITY_TOKEN="your_token_here"');
  console.log('');
  console.log('Or run with:');
  console.log('SANITY_TOKEN="your_token_here" node populatePneus.js');
  process.exit(1);
}

console.log('✅ SANITY_TOKEN is set');
console.log('');

// Import and run the populate script
try {
  require('./populatePneus.js');
} catch (error) {
  console.error('❌ Error running populate script:', error.message);
  process.exit(1);
} 