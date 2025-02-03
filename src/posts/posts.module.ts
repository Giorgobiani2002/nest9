import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { postSchema } from './schema/post.schema';
import { UsersModule } from 'src/users/users.module';
import { userSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'post', schema: postSchema},
      {name: 'user', schema: userSchema},
    ]),
    // UsersModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
