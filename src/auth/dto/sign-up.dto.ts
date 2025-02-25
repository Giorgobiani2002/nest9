import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'lasha GGGG',
    required: true,
  })
  @ApiProperty({
    example: 'lg@gmail.com',
    required: true,
  })
  @ApiProperty({
    example: 'lasha88123',
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
