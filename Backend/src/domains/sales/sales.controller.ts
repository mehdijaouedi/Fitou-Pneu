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
        utilisateurId: { type: 'string', nullable: true }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create sale' })
  async createSale(@Body() body: any) {
    try {
      const { saleType, products, grandTotal, clientEmail, utilisateurId } = body;

      // Create sale in Prisma
      const sale = await this.prisma.sale.create({
        data: {
          saleType,
          products,
          grandTotal,
          clientEmail,
          utilisateurId,
          status: 'pending',
          date: new Date(),
        },
        include: {
          utilisateur: true,
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
        utilisateurId: { type: 'string', nullable: true }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Sale updated successfully' })
  @ApiResponse({ status: 500, description: 'Failed to update sale' })
  async updateSale(@Param('id') id: string, @Body() body: any) {
    try {
      const { saleType, products, grandTotal, status, clientEmail, utilisateurId } = body;

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
        },
        include: {
          utilisateur: true,
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
} 