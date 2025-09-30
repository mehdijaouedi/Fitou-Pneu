import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { syncSaleToSanity } from '../../services/sanitySync';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        saleType: { type: 'string' },
        products: { type: 'array', items: { type: 'object' } },
        grandTotal: { type: 'number' },
        clientEmail: { type: 'string' },
        utilisateurId: { type: 'string', nullable: true },
        clientId: { type: 'string', nullable: true },
        client: { 
          type: 'object', 
          nullable: true,
          properties: {
            prenom: { type: 'string' },
            nom: { type: 'string' },
            email: { type: 'string' },
            adresse: { type: 'string' },
            numeroTelephone: { type: 'string' },
            pays: { type: 'string' },
            region: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create sale' })
  async createSale(@Body() body: any) {
    try {
      const { saleType, products, grandTotal, clientEmail, utilisateurId, clientId, client } = body;

      let finalClientId = clientId;

      // If client data is provided but no clientId, create or find the client
      if (client && !clientId) {
        const existingClient = await this.prisma.client.findUnique({
          where: { email: client.email }
        });

        if (existingClient) {
          finalClientId = existingClient.id;
        } else {
          const newClient = await this.prisma.client.create({
            data: {
              prenom: client.prenom,
              nom: client.nom,
              email: client.email,
              adresse: client.adresse,
              numeroTelephone: client.numeroTelephone,
              pays: client.pays,
              region: client.region || 'Nord France'
            }
          });
          finalClientId = newClient.id;
        }
      }

      // Create sale in Prisma
      const sale = await this.prisma.sale.create({
        data: {
          saleType,
          products,
          grandTotal,
          clientEmail,
          utilisateurId,
          clientId: finalClientId,
          status: 'pending',
          date: new Date(),
        },
        include: {
          utilisateur: true,
          client: true,
        }
      });

      // Sync to Sanity
      try {
        await syncSaleToSanity(sale.id);
      } catch (syncError) {
        console.error('Error syncing to Sanity:', syncError);
        // Continue even if Sanity sync fails - we can retry later
      }

      return sale;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        saleType: { type: 'string' },
        products: { type: 'array', items: { type: 'object' } },
        grandTotal: { type: 'number' },
        status: { type: 'string' },
        clientEmail: { type: 'string' },
        utilisateurId: { type: 'string', nullable: true },
        clientId: { type: 'string', nullable: true }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Sale updated successfully' })
  @ApiResponse({ status: 500, description: 'Failed to update sale' })
  async updateSale(@Param('id') id: string, @Body() body: any) {
    try {
      const { saleType, products, grandTotal, status, clientEmail, utilisateurId, clientId } = body;

      // Update sale in Prisma
      const sale = await this.prisma.sale.update({
        where: { id },
        data: {
          saleType,
          products,
          grandTotal,
          status,
          clientEmail,
          utilisateurId,
          clientId,
        },
        include: {
          utilisateur: true,
          client: true,
        }
      });

      // Sync to Sanity
      try {
        await syncSaleToSanity(sale.id);
      } catch (syncError) {
        console.error('Error syncing to Sanity:', syncError);
        // Continue even if Sanity sync fails - we can retry later
      }

      return sale;
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({ status: 200, description: 'List of all sales' })
  @ApiResponse({ status: 500, description: 'Failed to fetch sales' })
  async getSales() {
    try {
      return await this.prisma.sale.findMany({
        include: {
          utilisateur: true,
          client: true,
        },
        orderBy: {
          date: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({ status: 200, description: 'Sale details' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  @ApiResponse({ status: 500, description: 'Failed to fetch sale' })
  async getSaleById(@Param('id') id: string) {
    try {
      const sale = await this.prisma.sale.findUnique({
        where: { id },
        include: {
          utilisateur: true,
          client: true,
        },
      });

      if (!sale) {
        throw new Error('Sale not found');
      }

      return sale;
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  }

  @Get('clients/all')
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'List of all clients' })
  @ApiResponse({ status: 500, description: 'Failed to fetch clients' })
  async getClients() {
    try {
      return await this.prisma.client.findMany({
        orderBy: {
          prenom: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  @Post('clients')
  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prenom: { type: 'string' },
        nom: { type: 'string' },
        email: { type: 'string' },
        adresse: { type: 'string' },
        numeroTelephone: { type: 'string' },
        pays: { type: 'string' },
        region: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create client' })
  async createClient(@Body() body: any) {
    try {
      const { prenom, nom, email, adresse, numeroTelephone, pays, region } = body;

      // Check if client already exists
      const existingClient = await this.prisma.client.findUnique({
        where: { email }
      });

      if (existingClient) {
        return existingClient;
      }

      // Create new client
      const client = await this.prisma.client.create({
        data: {
          prenom,
          nom,
          email,
          adresse,
          numeroTelephone,
          pays,
          region: region || 'Nord France'
        }
      });

      return client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }
} 