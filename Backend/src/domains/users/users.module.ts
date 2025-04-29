import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
// import { MailService } from '../mail/mail.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService,JwtService,PrismaService,],
  imports: [],
})
export class UsersModule {}
