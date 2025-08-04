/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '././domains/users/users.module';
import { AuthModule } from '././domains/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { SyncModule } from './sync/sync.module';
import { ConfigModule } from '@nestjs/config';
import { SalesModule } from './domains/sales/sales.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    PrismaModule,
    SalesModule,
    SyncModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      envFilePath: './prisma/.env', // Specify the .env file path (optional, defaults to .env)
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
