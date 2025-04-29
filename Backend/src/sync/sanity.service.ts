import { createClient } from '@sanity/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
    const utilisateurs = await this.prisma.utilisateur.findMany();

    for (const utilisateur of utilisateurs) {
      try {
        const existingDoc = await this.client.fetch(
          `*[_type == "utilisateur" && dbId == $id][0]`,
          { id: utilisateur.id },
        );

        if (existingDoc) {
          console.log(`Updating existing utilisateur with dbId ${utilisateur.id}`);
          await this.client
            .patch(existingDoc._id)
            .set({
              _type: 'utilisateur',
              dbId: utilisateur.id,
              prenom: utilisateur.prenom,
              nom: utilisateur.nom,
              email: utilisateur.email,
              adresse: utilisateur.adress,
              numeroTelephone: utilisateur.numeroTelephone,
              pays: utilisateur.pays,        // Now a simple string
              password: utilisateur.password, // Required field
            })
            .commit();
        } else {
          console.log('Creating new utilisateur in Sanity');
          await this.client.create({
            _type: 'utilisateur',
            dbId: utilisateur.id,
            prenom: utilisateur.prenom,
            nom: utilisateur.nom,
            email: utilisateur.email,
            adresse: utilisateur.adress,
            numeroTelephone: utilisateur.numeroTelephone,
            pays: utilisateur.pays,        
            password: utilisateur.password,
          });
        }
      } catch (error) {
        console.error(`Error syncing utilisateur with ID ${utilisateur.id}:`, error);
      }
    }
  }

  async syncUtilisateursFromSanity() {
    console.log('Starting syncUtilisateursFromSanity...');

    try {
      const utilisateursList = await this.client.fetch(`*[_type == "utilisateur"]`);
      console.log(`Fetched ${utilisateursList.length} utilisateur documents from Sanity.`);

      for (const utilisateur of utilisateursList) {
        try {
          if (!utilisateur.dbId) {
            console.error(`Utilisateur document missing dbId for _id: ${utilisateur._id}`);
            continue;
          }

          const existingUtilisateur = await this.prisma.utilisateur.findUnique({
            where: { id: utilisateur.dbId },
          });

          if (existingUtilisateur) {
            await this.prisma.utilisateur.update({
              where: { id: utilisateur.dbId },
              data: {
                prenom: utilisateur.prenom,
                nom: utilisateur.nom,
                email: utilisateur.email,
                adress: utilisateur.adresse || 'Unknown address',
                numeroTelephone: utilisateur.numeroTelephone || '0000000000',
                pays: utilisateur.pays || 'Unknown',
                password: utilisateur.password || 'default_password', // Always required
              },
            });
            console.log(`Updated utilisateur with dbId ${utilisateur.dbId} in Prisma.`);
          } else {
            await this.prisma.utilisateur.create({
              data: {
                id: utilisateur.dbId,
                prenom: utilisateur.prenom,
                nom: utilisateur.nom,
                email: utilisateur.email,
                adress: utilisateur.adresse || 'Unknown address',
                numeroTelephone: utilisateur.numeroTelephone || '0000000000',
                pays: utilisateur.pays || 'Unknown',
                password: utilisateur.password || 'default_password',
              },
            });
            console.log(`Created new utilisateur with dbId ${utilisateur.dbId} in Prisma.`);
          }
        } catch (error) {
          console.error(`Error syncing utilisateur with ID ${utilisateur.dbId}:`, error);
        }
      }

      // Delete utilisateurs that exist in DB but not in Sanity
      try {
        const allDbUtilisateurs = await this.prisma.utilisateur.findMany();
        const sanityUserIds = new Set(utilisateursList.map(user => user.dbId));

        for (const dbUser of allDbUtilisateurs) {
          if (!sanityUserIds.has(dbUser.id)) {
            await this.prisma.utilisateur.delete({
              where: { id: dbUser.id },
            });
            console.log(`Deleted utilisateur with dbId ${dbUser.id} from Prisma as it no longer exists in Sanity.`);
          }
        }
      } catch (deleteError) {
        console.error('Error deleting utilisateurs from Prisma:', deleteError);
      }

    } catch (globalError) {
      console.error('Error fetching utilisateurs from Sanity:', globalError);
    }

    console.log('syncUtilisateursFromSanity completed.');
  }
}
