
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'posts title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;


  @ApiProperty({
    example: 'posts content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}