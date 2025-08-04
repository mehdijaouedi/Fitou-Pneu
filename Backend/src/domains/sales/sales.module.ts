import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SalesController],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class SalesModule {} 