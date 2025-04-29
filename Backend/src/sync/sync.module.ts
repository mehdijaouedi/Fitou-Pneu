import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SanityService } from './sanity.service';
import { SyncController } from './sync.controller';

@Module({
  controllers: [SyncController],
  providers: [PrismaService, SanityService],
})
export class SyncModule {}
