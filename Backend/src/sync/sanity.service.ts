import { createClient } from '@sanity/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SanityService {
  private client = createClient({
    projectId: 'rsg8mxls',
    dataset: 'production',
    token: 'skaBi5YBEOOa7FPzbLk0pZxD71pTauUVokgEA1dMGoZ4QZJYy9Enl239CeDrD2uUGFf4yghHnJsToCyGZZ44xbLLzFec0eE55I3EpG6h0lBrNKJz7cGfrSa89GJi26wkvGFWc8FzdZuZSlIxZQaYksE6I2m4YAhaxSgK9fxSenor7ILMb9Qg',
    useCdn: false,
  });

  constructor(private readonly prisma: PrismaService) {}

  async syncUtilisateursToSanity() {
    try {
      const utilisateurs = await this.prisma.utilisateur.findMany();
      console.log(`Found ${utilisateurs.length} utilisateurs to sync to Sanity`);

      for (const utilisateur of utilisateurs) {
        if (!utilisateur.id) {
          console.warn(`Skipping utilisateur ${utilisateur.email} - missing ID`);
          continue;
        }

        try {
          const existingDoc = await this.client.fetch(
            `*[_type == "client" && dbId == $dbId][0]`,
            { dbId: utilisateur.id }
          );

          const docData = {
            _type: 'client',
            dbId: utilisateur.id,
            prenom: utilisateur.prenom,
            nom: utilisateur.nom,
            email: utilisateur.email,
            adresse: utilisateur.adress,
            numeroTelephone: utilisateur.numeroTelephone,
            pays: utilisateur.pays,
            region: utilisateur.region || 'Nord France',
          };

          if (existingDoc && existingDoc._id) {
            await this.client.patch(existingDoc._id).set(docData).commit();
            console.log(`Updated client ${utilisateur.email} in Sanity`);
          } else {
            await this.client.create(docData);
            console.log(`Created new client ${utilisateur.email} in Sanity`);
          }
        } catch (error) {
          console.error(`Error syncing utilisateur ${utilisateur.email}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error in syncUtilisateursToSanity:', error.message);
    }
  }

  async syncUtilisateursFromSanity() {
    try {
      const sanityClients = await this.client.fetch(`
        *[_type == "client"] {
          _id,
          dbId,
          prenom,
          nom,
          email,
          adresse,
          numeroTelephone,
          pays,
          region
        }
      `);

      console.log(`Found ${sanityClients.length} clients in Sanity`);

      const existingUsers = await this.prisma.utilisateur.findMany();
      const existingUserMap = new Map(existingUsers.map(u => [u.id, u]));

      for (const client of sanityClients) {
        let dbId = client.dbId;

        // Generate dbId if missing
        if (!dbId) {
          dbId = uuidv4();
          try {
            await this.client.patch(client._id)
              .set({ dbId })
              .commit();
            console.log(`Added dbId to Sanity client ${client.email}`);
          } catch (err) {
            console.error(`Failed to update Sanity client ${client._id} with new dbId:`, err.message);
            continue; // Skip processing this client if we can't update Sanity
          }
        }

        const baseUserData = {
          prenom: client.prenom || '',
          nom: client.nom || '',
          email: client.email || '',
          adress: client.adresse || '',
          numeroTelephone: client.numeroTelephone || '',
          pays: client.pays || '',
          region: client.region || 'Nord France',
        };

        try {
          if (existingUserMap.has(dbId)) {
            await this.prisma.utilisateur.update({
              where: { id: dbId },
              data: baseUserData, // Do not update password
            });
            console.log(`Updated user ${dbId}`);
          } else {
            await this.prisma.utilisateur.create({
              data: {
                id: dbId,
                ...baseUserData,
                password: 'default_password', // Use secure logic in real app
              },
            });
            console.log(`Created new user ${dbId}`);
          }
        } catch (error) {
          console.error(`Error processing client ${dbId}:`, error.message);
        }
      }

      // Handle deletions
      const sanityDbIds = new Set(
        sanityClients.map(c => c.dbId || '').filter(Boolean)
      );

      const usersToDelete = existingUsers.filter(u => !sanityDbIds.has(u.id));

      for (const user of usersToDelete) {
        try {
          await this.prisma.utilisateur.delete({ where: { id: user.id } });
          console.log(`Deleted user ${user.id} not found in Sanity`);
        } catch (error) {
          console.error(`Error deleting user ${user.id}:`, error.message);
        }
      }

    } catch (error) {
      console.error('Error in syncUtilisateursFromSanity:', error.message);
    }
  }

  async createSale(saleData: any) {
    // saleData should include: clientEmail, products (array), grandTotal, status, date, etc.
    if (!saleData.products || !Array.isArray(saleData.products)) {
      throw new Error('Missing or invalid products array in request body');
    }
    const saleDoc = {
      _type: 'sale',
      clientEmail: saleData.clientEmail,
      products: saleData.products.map((p: any) => ({
        _type: 'object',
        productType: p.productType,
        product: { _type: 'reference', _ref: p.id },
        quantity: p.quantity,
        price: p.price,
        totalPrice: p.price * p.quantity
      })),
      grandTotal: saleData.grandTotal,
      status: saleData.status || 'pending',
      date: saleData.date || new Date().toISOString(),
    };
    return await this.client.create(saleDoc);
  }
}