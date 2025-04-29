import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/domains/users/dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Utilisateur } from '@prisma/client';
import { Socket } from 'socket.io';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  invalidateToken(token: any) {
    throw new Error('Method not implemented.');
  }
  private connectedUsers: { [userId: string]: Socket } = {};

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.password, salt);
      console.log(userDto, 'eryy');

      status.data = await this.usersService.create({
        ...userDto,
        password: hashedPassword,
      });
      console.log(status.data);
    } catch (err) {
      console.log(err.message, '----------------------');

      if (
        err.message.includes(
          'Unique constraint failed on the fields: (`email`)',
        )
      ) {
        status = {
          success: false,
          message: 'Email is already registered',
        };
      } else {
        status = {
          success: false,
          message: err.message,
        };
      }
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.utilisateur.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

   

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
    }

    const token = this._createToken(user);
    return { Authorization: `Bearer ${token}`, user };
  }

  async loginAdmin(UserLogin: LoginUserDto): Promise<any> {
    // Find the user by email
    const user = await this.usersService.findByLogin(UserLogin.email);
      
    // If the password does not match, throw an unauthorized error
    const isPasswordValid = await this.comparePassword(UserLogin.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  
    // Create and return the token if credentials are valid
    const token = this._createToken(user);
    return token;
  }
  
  // Helper method to compare passwords (you might use bcrypt or another hashing library)
  private async comparePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    // Assuming you're using bcrypt to compare the passwords
    return bcrypt.compare(inputPassword, storedPassword);
  }
  

  private _createToken(user: any): any {
    const payload = { email: user.email, id: user.id, isAdmin: user.isAdmin };
    const Authorization = this.jwtService.sign(payload);
    return {
      expiresIn: process.env.EXPIRESIN,
      Authorization,
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async me(token: string) {
    const payload = this.jwtService.decode(token) as any;
    return payload;
  }

  async meAdmin(token: string) {
    const payload = this.jwtService.decode(token) as any;

    if (!payload || !payload.isAdmin) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prisma.utilisateur.findUnique({
      where: { id: payload.id },
    });

    if (!user ) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async forgotPassword(email: string) {
    const result = await this.prisma.utilisateur.findUnique({
      where: { email },
    });

    if (result) {
      return {
        message: 'check your email',
      };
    }
  }

  async changePassword(
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    if (confirmPassword === password) {
      const result = await this.prisma.utilisateur.findUnique({
        where: { email },
      });
      if (result) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await this.prisma.utilisateur.update({
          where: { id: result.id },
          data: { password: hashedPassword },
        });

        return result;
      }
    } else {
      throw new HttpException('passwords do not match', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateAuthDto) {
    const { prenom, nom, email, password } = dto;
    let data = {};

    if (prenom) {
      data = { ...data, prenom };
    }
    if (nom) {
      data = { ...data, nom };
    }
    if (email) {
      data = { ...data, email };
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      data = { ...data, password: hashedPassword };
    }

    const updatedUser = await this.prisma.utilisateur.update({
      where: { id },
      data,
    });

    return this._createToken(updatedUser);
  }

 
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
  data?: Utilisateur;
}
