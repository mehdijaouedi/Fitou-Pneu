import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  prenom?: string; 

  @ApiProperty({ required: false })
  nom?: string; 

  @ApiProperty({ required: true })
  email!: string;

  @ApiProperty({ required: true })
  password!: string;

  @ApiProperty({ required: false })
  numeroTelephone?: string; 

  @ApiProperty({ required: false })
  adress?: string; 
  
};