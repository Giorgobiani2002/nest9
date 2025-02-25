import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class SignUpDto {
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
