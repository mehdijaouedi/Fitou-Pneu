import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class UtilisateurEntity {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly prenom: string;

  @ApiProperty()
  @IsString()
  readonly nom: string;

  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly adress: string;

  @ApiProperty()
  @IsString()
  readonly numeroTelephone: string;


  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

 
}
