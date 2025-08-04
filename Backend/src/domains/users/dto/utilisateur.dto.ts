// dto/utilisateur.dto.ts
import { IsString, IsEmail } from 'class-validator';

export class UtilisateurDto {
  @IsString()
  id: string;

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
}
