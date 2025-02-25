import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    
    @ApiProperty({
        example: 'lasha',
        required: true,
      })
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string
    
    @ApiProperty({
        example: 'lashagiorgobiani@gmail.com',
        required: true,
      })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumber()
    @IsNotEmpty()
    age: number
}
