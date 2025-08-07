import { createClient } from '@sanity/client';

// Initialize Sanity client
const client = createClient({
  projectId: 'rsg8mxls',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // You'll need to set this environment variable
});

// Data from the Excel spreadsheet
const pneusData = [
  {
    ean: '6972508642560',
    sap: '1018199',
    itemNo: 'CL1948H1',
    size: '155/70R12',
    width: 155,
    aspectRatio: 70,
    diameter: 12,
    liSi: '73T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457757',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 70,
    cat: 'C1',
    qty40hc: 2230,
    sellPrice: 19.90,
    buyPrice: 15.92, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642577',
    sap: '1018200',
    itemNo: 'CL1948H2',
    size: '145/80R12',
    width: 145,
    aspectRatio: 80,
    diameter: 12,
    liSi: '71T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457758',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 71,
    cat: 'C1',
    qty40hc: 2710,
    sellPrice: 18.40,
    buyPrice: 14.72, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642584',
    sap: '1018201',
    itemNo: 'CL1948H3',
    size: '155/80R12',
    width: 155,
    aspectRatio: 80,
    diameter: 12,
    liSi: '75T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457759',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 71,
    cat: 'C1',
    qty40hc: 2500,
    sellPrice: 20.10,
    buyPrice: 16.08, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642591',
    sap: '1018202',
    itemNo: 'CL1948H4',
    size: '165/70R12',
    width: 165,
    aspectRatio: 70,
    diameter: 12,
    liSi: '77T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457760',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 72,
    cat: 'C1',
    qty40hc: 2200,
    sellPrice: 21.50,
    buyPrice: 17.20, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642607',
    sap: '1018203',
    itemNo: 'CL1948H5',
    size: '175/70R12',
    width: 175,
    aspectRatio: 70,
    diameter: 12,
    liSi: '81T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457761',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 73,
    cat: 'C1',
    qty40hc: 2000,
    sellPrice: 23.20,
    buyPrice: 18.56, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642614',
    sap: '1018204',
    itemNo: 'CL1948H6',
    size: '145/80R13',
    width: 145,
    aspectRatio: 80,
    diameter: 13,
    liSi: '75T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457762',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 71,
    cat: 'C1',
    qty40hc: 2600,
    sellPrice: 19.80,
    buyPrice: 15.84, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642621',
    sap: '1018205',
    itemNo: 'CL1948H7',
    size: '155/80R13',
    width: 155,
    aspectRatio: 80,
    diameter: 13,
    liSi: '79T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457763',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 72,
    cat: 'C1',
    qty40hc: 2400,
    sellPrice: 21.40,
    buyPrice: 17.12, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642638',
    sap: '1018206',
    itemNo: 'CL1948H8',
    size: '165/80R13',
    width: 165,
    aspectRatio: 80,
    diameter: 13,
    liSi: '83T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457764',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 73,
    cat: 'C1',
    qty40hc: 2200,
    sellPrice: 23.60,
    buyPrice: 18.88, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642645',
    sap: '1018207',
    itemNo: 'CL1948H9',
    size: '175/80R13',
    width: 175,
    aspectRatio: 80,
    diameter: 13,
    liSi: '86T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457765',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 74,
    cat: 'C1',
    qty40hc: 2000,
    sellPrice: 25.80,
    buyPrice: 20.64, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642652',
    sap: '1018208',
    itemNo: 'CL1948H10',
    size: '185/80R13',
    width: 185,
    aspectRatio: 80,
    diameter: 13,
    liSi: '88T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457766',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 75,
    cat: 'C1',
    qty40hc: 1800,
    sellPrice: 28.20,
    buyPrice: 22.56, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642669',
    sap: '1018209',
    itemNo: 'CL1948H11',
    size: '155/70R13',
    width: 155,
    aspectRatio: 70,
    diameter: 13,
    liSi: '75T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457767',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 71,
    cat: 'C1',
    qty40hc: 2400,
    sellPrice: 20.90,
    buyPrice: 16.72, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642676',
    sap: '1018210',
    itemNo: 'CL1948H12',
    size: '165/70R13',
    width: 165,
    aspectRatio: 70,
    diameter: 13,
    liSi: '79T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457768',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 72,
    cat: 'C1',
    qty40hc: 2200,
    sellPrice: 22.50,
    buyPrice: 18.00, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642683',
    sap: '1018211',
    itemNo: 'CL1948H13',
    size: '175/70R13',
    width: 175,
    aspectRatio: 70,
    diameter: 13,
    liSi: '82T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457769',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 73,
    cat: 'C1',
    qty40hc: 2000,
    sellPrice: 24.30,
    buyPrice: 19.44, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642690',
    sap: '1018212',
    itemNo: 'CL1948H14',
    size: '185/70R13',
    width: 185,
    aspectRatio: 70,
    diameter: 13,
    liSi: '85T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457770',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 74,
    cat: 'C1',
    qty40hc: 1800,
    sellPrice: 26.70,
    buyPrice: 21.36, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642706',
    sap: '1018213',
    itemNo: 'CL1948H15',
    size: '195/70R13',
    width: 195,
    aspectRatio: 70,
    diameter: 13,
    liSi: '88T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457771',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 75,
    cat: 'C1',
    qty40hc: 1600,
    sellPrice: 29.10,
    buyPrice: 23.28, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642713',
    sap: '1018214',
    itemNo: 'CL1948H16',
    size: '205/70R13',
    width: 205,
    aspectRatio: 70,
    diameter: 13,
    liSi: '91T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457772',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 76,
    cat: 'C1',
    qty40hc: 1400,
    sellPrice: 31.50,
    buyPrice: 25.20, // Assuming 20% margin
    isPromotion: false
  },
  {
    ean: '6972508642720',
    sap: '1018215',
    itemNo: 'CL1948H17',
    size: '165/65R14',
    width: 165,
    aspectRatio: 65,
    diameter: 14,
    liSi: '79T',
    extra: '',
    pattern: 'BLAZER HP',
    eprelCode: '457773',
    rr: 'D',
    wg: 'C',
    soundClass: 'B',
    soundDb: 72,
    cat: 'C1',
    qty40hc: 2200,
    sellPrice: 23.80,
    buyPrice: 19.04, // Assuming 20% margin
    isPromotion: false
  }
];

// Function to delete all existing pneus
async function deleteAllPneus() {
  try {
    console.log('Deleting all existing pneus...');
    
    // Get all existing pneus IDs
    const existingPneus = await client.fetch('*[_type == "pneu"]._id');
    
    if (existingPneus.length > 0) {
      // Delete all existing pneus
      const deleteOperations = existingPneus.map(id => ({
        delete: { id }
      }));
      
      await client.transaction(deleteOperations).commit();
      console.log(`Deleted ${existingPneus.length} existing pneus`);
    } else {
      console.log('No existing pneus found to delete');
    }
  } catch (error) {
    console.error('Error deleting existing pneus:', error);
    throw error;
  }
}

// Function to create pneu documents
async function createPneus() {
  try {
    console.log('Creating new pneus...');
    
    const now = new Date().toISOString();
    
    const pneuDocuments = pneusData.map((pneu, index) => ({
      _type: 'pneu',
      dateAdded: now,
      lastUpdated: now,
      name: `BLAZER HP ${pneu.size}`,
      description: `BLAZER HP tire in size ${pneu.size} with ${pneu.liSi} rating`,
      brand: 'COMPASAL',
      model: 'BLAZER HP',
      reference: pneu.itemNo,
      sizes: [{
        size: pneu.size,
        quantity: 0, // Initial quantity
        price: pneu.sellPrice,
        nordPrice: pneu.sellPrice,
        sudPrice: pneu.sellPrice,
        purchasePrice: pneu.buyPrice,
        sellingPrice: pneu.sellPrice,
        speedRating: pneu.liSi.slice(-1), // Extract speed rating (T, H, etc.)
        loadIndex: parseInt(pneu.liSi.slice(0, -1)), // Extract load index
        ean: pneu.ean,
        sap: pneu.sap,
        itemNo: pneu.itemNo,
        liSi: pneu.liSi,
        extra: pneu.extra,
        eprelCode: pneu.eprelCode,
        rr: pneu.rr,
        wg: pneu.wg,
        soundClass: pneu.soundClass,
        soundDb: pneu.soundDb,
        cat: pneu.cat,
        qty40hc: pneu.qty40hc
      }],
      pattern: 'BLAZER HP',
      season: 'all_season',
      status: 'in_stock',
      isPromotion: pneu.isPromotion,
      promotionDiscount: pneu.isPromotion ? 10 : 0, // 10% discount for promotional items
      runFlat: false,
      ratings: {
        noise: pneu.soundClass === 'A' ? 1 : pneu.soundClass === 'B' ? 2 : 3,
        wetGrip: pneu.wg,
        fuelEfficiency: pneu.rr
      }
    }));
    
    // Create all pneus in a single transaction
    const createOperations = pneuDocuments.map(doc => ({
      create: doc
    }));
    
    await client.transaction(createOperations).commit();
    console.log(`Successfully created ${pneuDocuments.length} pneus`);
    
  } catch (error) {
    console.error('Error creating pneus:', error);
    throw error;
  }
}

// Main function to populate the database
async function populatePneus() {
  try {
    console.log('Starting pneus population...');
    
    // First delete all existing pneus
    await deleteAllPneus();
    
    // Then create new pneus
    await createPneus();
    
    console.log('Pneus population completed successfully!');
  } catch (error) {
    console.error('Error populating pneus:', error);
  }
}

// Run the script
populatePneus(); 