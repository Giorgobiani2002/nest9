import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { HasUserId } from './guards/hasUserId.guard';
import { IsAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/users.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('posts')
@UseGuards(IsAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Req() request, @Body() createPostDto: CreatePostDto) {
    const userId = request.userId;
    return this.postsService.create(userId, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @User() user,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(user.id, user.role, postId, updatePostDto);
  }

  @Delete(':id')
  async remove(@User() user, @Param('id') postId: string) {
    return this.postsService.remove(user.id, user.role, postId);
  }
}
