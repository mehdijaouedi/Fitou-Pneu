const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@sanity/client');

const prisma = new PrismaClient();

// Sanity client
const sanityClient = createClient({
  projectId: 'rsg8mxls',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  // Note: You might need to add a token for write operations
});

async function ensureClientInSanity(client) {
  try {
    // Check if client already exists in Sanity
    const existingClient = await sanityClient.fetch(
      `*[_type == "client" && email == $email][0]`,
      { email: client.email }
    );

    if (existingClient) {
      console.log(`Client ${client.email} already exists in Sanity`);
      return existingClient;
    }

    // Create new client in Sanity
    const sanityClientDoc = await sanityClient.create({
      _type: 'client',
      prenom: client.prenom,
      nom: client.nom,
      email: client.email,
      adresse: client.adresse,
      numeroTelephone: client.numeroTelephone,
      pays: client.pays,
      region: client.region,
      dbId: client.id
    });

    console.log(`Created client ${client.email} in Sanity with ID: ${sanityClientDoc._id}`);
    return sanityClientDoc;
  } catch (error) {
    console.error('Error ensuring client in Sanity:', error);
    return null;
  }
}

async function fixSalesClients() {
  try {
    console.log('Starting to fix sales clients...\n');

    // Get all unique client emails from sales
    const sales = await prisma.sale.findMany({
      select: {
        clientEmail: true,
        utilisateur: true
      },
      distinct: ['clientEmail']
    });

    console.log(`Found ${sales.length} unique client emails`);

    // Create clients for each unique email
    const clientMap = new Map();

    for (const sale of sales) {
      if (!sale.clientEmail) continue;

      console.log(`\nProcessing email: ${sale.clientEmail}`);

      // Check if client already exists
      let client = await prisma.client.findUnique({
        where: { email: sale.clientEmail }
      });

      if (!client) {
        // Create client from utilisateur data or use defaults
        const clientData = {
          prenom: sale.utilisateur?.prenom || 'Unknown',
          nom: sale.utilisateur?.nom || 'Client',
          email: sale.clientEmail,
          adresse: sale.utilisateur?.adress || 'Unknown Address',
          numeroTelephone: sale.utilisateur?.numeroTelephone || 'Unknown',
          pays: sale.utilisateur?.pays || 'France',
          region: sale.utilisateur?.region || 'Nord France'
        };

        client = await prisma.client.create({
          data: clientData
        });

        console.log(`Created client: ${client.prenom} ${client.nom} (${client.email})`);
      } else {
        console.log(`Client already exists: ${client.prenom} ${client.nom} (${client.email})`);
      }

      clientMap.set(sale.clientEmail, client);
    }

    console.log(`\nCreated/found ${clientMap.size} clients`);

    // Update all sales with clientId
    console.log('\nUpdating sales with client relationships...');
    
    const allSales = await prisma.sale.findMany();
    let updatedCount = 0;

    for (const sale of allSales) {
      if (sale.clientEmail && clientMap.has(sale.clientEmail)) {
        const client = clientMap.get(sale.clientEmail);
        
        await prisma.sale.update({
          where: { id: sale.id },
          data: { clientId: client.id }
        });

        console.log(`Updated sale ${sale.id} with client ${client.id}`);
        updatedCount++;
      }
    }

    console.log(`\nUpdated ${updatedCount} sales with client relationships`);

    // Sync clients to Sanity
    console.log('\nSyncing clients to Sanity...');
    for (const [email, client] of clientMap) {
      try {
        await ensureClientInSanity(client);
      } catch (error) {
        console.error(`Error syncing client ${email} to Sanity:`, error);
      }
    }

    // Sync sales to Sanity
    console.log('\nSyncing sales to Sanity...');
    const salesWithClients = await prisma.sale.findMany({
      include: {
        client: true,
        utilisateur: true
      }
    });

    for (const sale of salesWithClients) {
      try {
        await syncSaleToSanity(sale);
        console.log(`Synced sale ${sale.id} to Sanity`);
      } catch (error) {
        console.error(`Error syncing sale ${sale.id}:`, error);
      }
    }

    console.log('\n✅ Finished fixing sales clients!');
  } catch (error) {
    console.error('Error fixing sales clients:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function syncSaleToSanity(sale) {
  try {
    // Find the existing Sanity document
    const existingSale = await sanityClient.fetch(
      `*[_type == "sale" && dbId == $saleId][0]`,
      { saleId: sale.id }
    );

    const saleData = {
      _type: 'sale',
      date: sale.date.toISOString(),
      clientEmail: sale.clientEmail || '',
      saleType: sale.saleType,
      products: sale.products,
      grandTotal: sale.grandTotal,
      status: sale.status,
      dbId: sale.id
    };

    // Add client reference
    if (sale.client) {
      const sanityClientDoc = await ensureClientInSanity(sale.client);
      if (sanityClientDoc) {
        saleData.client = {
          _type: 'reference',
          _ref: sanityClientDoc._id
        };
      }
    } else if (sale.utilisateur) {
      saleData.client = {
        _type: 'reference',
        _ref: sale.utilisateurId
      };
    }

    if (existingSale) {
      // Update existing sale
      await sanityClient
        .patch(existingSale._id)
        .set(saleData)
        .commit();
    } else {
      // Create new sale
      await sanityClient.create(saleData);
    }
  } catch (error) {
    console.error('Error syncing sale to Sanity:', error);
    throw error;
  }
}

// Run the fix
fixSalesClients();