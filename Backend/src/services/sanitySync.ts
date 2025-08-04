import { PrismaClient } from '@prisma/client';
import sanityClient from '../config/sanity';

const prisma = new PrismaClient();

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
    // Get the sale from Prisma with user details
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        utilisateur: true,
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
      clientEmail: sale.clientEmail,
      saleType: sale.saleType,
      products: sale.products,
      grandTotal: sale.grandTotal,
      status: sale.status,
      dbId: sale.id
    };

    // Add client reference if it's a registered user
    if (sale.utilisateur) {
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
    // Get the sale from Prisma with user details
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        utilisateur: true,
      },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Find the existing Sanity document
    const existingSale = await sanityClient.fetch(
      `*[_type == "sale" && _id == $saleId][0]`,
      { saleId }
    );

    if (!existingSale) {
      return syncSaleToSanity(saleId);
    }

    // Update the sale document in Sanity
    const sanitySale = await sanityClient
      .patch(existingSale._id)
      .set({
        date: sale.date.toISOString(),
        client: {
          _type: 'reference',
          _ref: sale.utilisateurId,
        },
        clientEmail: sale.utilisateur.email,
        saleType: sale.saleType,
        products: sale.products,
        grandTotal: sale.grandTotal,
        status: sale.status,
      })
      .commit();

    return sanitySale;
  } catch (error) {
    console.error('Error updating sale in Sanity:', error);
    throw error;
  }
} 