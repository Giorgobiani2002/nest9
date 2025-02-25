import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('post') private postModel: Model<Post>,
    @InjectModel('user') private userModel: Model<User>,
    // private userService: UsersService
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const limitsOfPosts = {
      free: 10,
      basic: 100,
      premium: 300,
    };

    const userPostsCount = await this.postModel.countDocuments({
      user: user._id,
    });

    if (userPostsCount >= limitsOfPosts[user.subscriptionPlan]) {
      throw new BadRequestException(
        `You have reached your post limit for the ${user.subscriptionPlan} plan`,
      );
    }

    const newPost = await this.postModel.create({
      ...createPostDto,
      user: user._id,
    });
    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { posts: newPost._id },
    });

    return newPost;
  }

  findAll() {
    return this.postModel
      .find()
      .populate({ path: 'user', select: '-posts -createdAt -__v' });
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const post = await this.postModel.findById(id).populate('user');
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(
    userId: string,
    role: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
    if (!isValidObjectId(postId)) throw new BadRequestException('Invalid ID');

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    
    if (post.user.toString() !== userId && role !== 'admin') {
      throw new UnauthorizedException('Permission denied');
    }

    return this.postModel.findByIdAndUpdate(postId, updatePostDto, {
      new: true,
    });
  }

  async remove(userId: string, role: string, postId: string) {
    if (!isValidObjectId(postId)) throw new BadRequestException('Invalid ID');

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    
    if (post.user.toString() !== userId && role !== 'admin') {
      throw new UnauthorizedException('Permission denied');
    }

    await this.postModel.findByIdAndDelete(postId);
    await this.userModel.findByIdAndUpdate(post.user, {
      $pull: { posts: postId },
    });

    return { message: 'Post deleted successfully' };
  }
}
