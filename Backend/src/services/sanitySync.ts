import { PrismaClient } from '@prisma/client';
import sanityClient from '../config/sanity';

const prisma = new PrismaClient();

// Helper function to ensure client exists in Sanity
async function ensureClientInSanity(client: any) {
  try {
    // Check if client already exists in Sanity
    const existingClient = await sanityClient.fetch(
      `*[_type == "client" && email == $email][0]`,
      { email: client.email }
    );

    if (existingClient) {
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

    return sanityClientDoc;
  } catch (error) {
    console.error('Error ensuring client in Sanity:', error);
    return null;
  }
}

interface SanitySaleData {
  _type: string;
  date: string;
  clientEmail: string;
  saleType: string;
  products: any;
  grandTotal: number;
  status: string;
  dbId: string;
  client?: {
    _type: string;
    _ref: string;
  };
}

export async function syncSaleToSanity(saleId: string) {
  try {
    // Get the sale from Prisma with user and client details
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        utilisateur: true,
        client: true,
      }
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Find the existing Sanity document
    const existingSale = await sanityClient.fetch(
      `*[_type == "sale" && dbId == $saleId][0]`,
      { saleId }
    );

    const saleData: SanitySaleData = {
      _type: 'sale',
      date: sale.date.toISOString(),
      clientEmail: sale.clientEmail || '',
      saleType: sale.saleType,
      products: sale.products,
      grandTotal: sale.grandTotal,
      status: sale.status,
      dbId: sale.id
    };

    // Add client reference - prioritize direct client relationship
    if (sale.client) {
      // First, ensure the client exists in Sanity
      const sanityClientDoc = await ensureClientInSanity(sale.client);
      if (sanityClientDoc) {
        saleData.client = {
          _type: 'reference',
          _ref: sanityClientDoc._id
        };
      }
    } else if (sale.utilisateur) {
      // Fallback to registered user
      saleData.client = {
        _type: 'reference',
        _ref: sale.utilisateurId
      };
    } else if (sale.clientEmail) {
      // Try to find the client in Sanity by email
      const client = await sanityClient.fetch(
        `*[_type == "client" && email == $email][0]`,
        { email: sale.clientEmail }
      );
      if (client && client._id) {
        saleData.client = {
          _type: 'reference',
          _ref: client._id
        };
      }
    }

    let sanitySale;
    if (existingSale) {
      // Update existing sale
      sanitySale = await sanityClient
        .patch(existingSale._id)
        .set(saleData)
        .commit();
    } else {
      // Create new sale
      sanitySale = await sanityClient.create(saleData);
    }

    return sanitySale;
  } catch (error) {
    console.error('Error syncing sale to Sanity:', error);
    throw error;
  }
}

export async function updateSaleInSanity(saleId: string) {
  try {
    // Get the sale from Prisma with user and client details
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        utilisateur: true,
        client: true,
      },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Find the existing Sanity document
    const existingSale = await sanityClient.fetch(
      `*[_type == "sale" && dbId == $saleId][0]`,
      { saleId }
    );

    if (!existingSale) {
      return syncSaleToSanity(saleId);
    }

    // Prepare client reference
    let clientRef = null;
    if (sale.client) {
      const sanityClientDoc = await ensureClientInSanity(sale.client);
      if (sanityClientDoc) {
        clientRef = {
          _type: 'reference',
          _ref: sanityClientDoc._id,
        };
      }
    } else if (sale.utilisateur) {
      clientRef = {
        _type: 'reference',
        _ref: sale.utilisateurId,
      };
    }

    // Update the sale document in Sanity
    const updateData: any = {
      date: sale.date.toISOString(),
      clientEmail: sale.clientEmail || '',
      saleType: sale.saleType,
      products: sale.products,
      grandTotal: sale.grandTotal,
      status: sale.status,
    };

    if (clientRef) {
      updateData.client = clientRef;
    }

    const sanitySale = await sanityClient
      .patch(existingSale._id)
      .set(updateData)
      .commit();

    return sanitySale;
  } catch (error) {
    console.error('Error updating sale in Sanity:', error);
    throw error;
  }
} 