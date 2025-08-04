import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  adress: string;

  @IsString()
  numeroTelephone: string;

  @IsString()
  pays: string;

  @IsString()
  region: string;

  @IsString()
  password: string;
}
