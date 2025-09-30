const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSales() {
  try {
    console.log('Checking current sales state...\n');

    // Get all sales
    const sales = await prisma.sale.findMany({
      include: {
        client: true,
        utilisateur: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    console.log(`Total sales: ${sales.length}\n`);

    sales.forEach((sale, index) => {
      console.log(`Sale ${index + 1}:`);
      console.log(`  ID: ${sale.id}`);
      console.log(`  Date: ${sale.date}`);
      console.log(`  Sale Type: ${sale.saleType}`);
      console.log(`  Grand Total: €${sale.grandTotal}`);
      console.log(`  Status: ${sale.status}`);
      console.log(`  Client Email: ${sale.clientEmail}`);
      console.log(`  Client ID: ${sale.clientId || 'NULL'}`);
      console.log(`  Client: ${sale.client ? `${sale.client.prenom} ${sale.client.nom}` : 'NULL'}`);
      console.log(`  Utilisateur: ${sale.utilisateur ? `${sale.utilisateur.prenom} ${sale.utilisateur.nom}` : 'NULL'}`);
      console.log('---');
    });

    // Check clients
    const clients = await prisma.client.findMany();
    console.log(`\nTotal clients: ${clients.length}`);
    
    clients.forEach((client, index) => {
      console.log(`Client ${index + 1}: ${client.prenom} ${client.nom} (${client.email})`);
    });

  } catch (error) {
    console.error('Error checking sales:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSales();
