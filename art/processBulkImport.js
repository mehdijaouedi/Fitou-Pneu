import { createClient } from '@sanity/client';

// Initialize Sanity client
const client = createClient({
  projectId: 'rsg8mxls',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // You'll need to set this environment variable
});

// Function to parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const dataRows = lines.slice(1);

  return dataRows.map((row, index) => {
    const values = row.split(',').map(v => v.trim());
    const rowData = {};
    
    headers.forEach((header, i) => {
      rowData[header] = values[i] || '';
    });

    return rowData;
  }).filter(row => row.EAN && row.SIZE); // Only include rows with essential data
}

// Function to get bulk import data from Sanity
async function getBulkImportData() {
  try {
    console.log('Fetching bulk import data from Sanity...');
    
    const bulkImports = await client.fetch(`
      *[_type == "bulkImport" && status == "pending"] {
        _id,
        title,
        excelData,
        status
      }
    `);
    
    return bulkImports;
  } catch (error) {
    console.error('Error fetching bulk import data:', error);
    throw error;
  }
}

// Function to create pneu documents from CSV data
async function createPneusFromCSV(csvData, importId) {
  try {
    console.log('Parsing CSV data...');
    const parsedData = parseCSV(csvData);
    
    console.log(`Found ${parsedData.length} products to process`);
    
    const now = new Date().toISOString();
    
    const pneuDocuments = parsedData.map(row => ({
      _type: 'pneu',
      name: `BLAZER HP ${row.SIZE}`,
      brand: 'COMPASAL',
      model: 'BLAZER HP',
      ean: row.EAN,
      sap: row.SAP,
      itemNo: row['ITEM NO.'],
      size: row.SIZE,
      liSi: row['LI/SI'],
      extra: row.Extra || '',
      pattern: row.Pattern || 'BLAZER HP',
      eprelCode: row['EPREL CODE'],
      rr: row.RR,
      wg: row.WG,
      soundClass: row['SOUND CLASS'],
      soundDb: parseInt(row['SOUND DB']) || 0,
      cat: row.CAT,
      qty40hc: parseInt(row['QTY /40\'HC']) || 0,
      sellPrice: parseFloat(row.Price) || 0,
      buyPrice: (parseFloat(row.Price) || 0) * 0.8, // 20% margin
      isPromotion: false,
      dateAdded: now,
      lastUpdated: now
    }));
    
    // Create all pneus in a single transaction
    const createOperations = pneuDocuments.map(doc => ({
      create: doc
    }));
    
    await client.transaction(createOperations).commit();
    console.log(`Successfully created ${pneuDocuments.length} pneus`);
    
    // Update the bulk import status
    await client
      .patch(importId)
      .set({
        status: 'completed',
        importDate: now
      })
      .commit();
    
    console.log('Updated bulk import status to completed');
    
    return pneuDocuments.length;
    
  } catch (error) {
    console.error('Error creating pneus from CSV:', error);
    
    // Update the bulk import status to failed
    await client
      .patch(importId)
      .set({
        status: 'failed',
        importDate: new Date().toISOString()
      })
      .commit();
    
    throw error;
  }
}

// Main function to process bulk imports
async function processBulkImports() {
  try {
    console.log('🚀 Starting bulk import processing...');
    
    // Get pending bulk imports
    const bulkImports = await getBulkImportData();
    
    if (bulkImports.length === 0) {
      console.log('No pending bulk imports found');
      return;
    }
    
    console.log(`Found ${bulkImports.length} pending bulk imports`);
    
    // Process each bulk import
    for (const bulkImport of bulkImports) {
      console.log(`Processing bulk import: ${bulkImport.title}`);
      
      try {
        // Update status to processing
        await client
          .patch(bulkImport._id)
          .set({ status: 'processing' })
          .commit();
        
        // Process the CSV data
        const processedCount = await createPneusFromCSV(bulkImport.excelData, bulkImport._id);
        
        console.log(`✅ Successfully processed ${processedCount} products from "${bulkImport.title}"`);
        
      } catch (error) {
        console.error(`❌ Failed to process bulk import "${bulkImport.title}":`, error.message);
      }
    }
    
    console.log('🎉 Bulk import processing completed!');
    
  } catch (error) {
    console.error('❌ Error processing bulk imports:', error);
  }
}

// Run the script
processBulkImports(); 