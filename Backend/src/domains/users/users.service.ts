import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/domains/users/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { Utilisateur } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Find user by email (Login)
  async findByLogin(email: string): Promise<Utilisateur | null> {
    const user = await this.prisma.utilisateur.findFirst({
      where: { email },
    });
    return user; // null if not found
  }

  // Create new user
  async create(userDto: CreateUserDto): Promise<Utilisateur> {
    const { email, ...rest } = userDto;

    // Check if email already exists
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.prisma.utilisateur.create({
      data: {
        email,
        ...rest,
      },
    });
  }

  // Find user by payload (email)
  async findByPayload(payload: { email: string }): Promise<Utilisateur | null> {
    return this.prisma.utilisateur.findUnique({
      where: { email: payload.email },
    });
  }

  // Get all users
  async findAll(): Promise<Utilisateur[]> {
    return this.prisma.utilisateur.findMany();
  }

  // Find one user by ID
  async findOne(id: string): Promise<Utilisateur> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Delete user by ID
  async remove(id: string): Promise<Utilisateur> {
    const user = await this.findOne(id);

    return this.prisma.utilisateur.delete({
      where: { id: user.id },
    });
  }

  // Update user details
  async update(id: string, dto: UpdateUserDto): Promise<Utilisateur> {
    const user = await this.findOne(id);

    return this.prisma.utilisateur.update({
      where: { id: user.id },
      data: dto,
    });
  }

  // Update user password
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<Utilisateur> {
    const user = await this.findOne(id);

    const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);

    return this.prisma.utilisateur.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
