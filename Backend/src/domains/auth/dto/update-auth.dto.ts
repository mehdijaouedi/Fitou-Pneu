import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  confirmPassword: string;

  @ApiProperty()
  password: string;
}

export class UpdateAuthDto {
  @ApiProperty()
  prenom?: string; 

  @ApiProperty()
  nom?: string; 

  @ApiProperty()
  email?: string; 

  @ApiProperty()
  password?: string;
}
