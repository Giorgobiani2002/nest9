import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private usersModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('User Alraedy exists');
    const user = await this.usersModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.usersModel.find().populate({ path: 'posts', select: '-user' });
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invaid Id');
    const user = await this.usersModel.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async update(
    role: string,
    tokenId: string,
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    if (tokenId !== id && role !== 'admin') {
      throw new UnauthorizedException('Permission denied');
    }

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(role: string, tokenId: string, id: string) {
    if (role !== 'admin' && tokenId !== id) {
      throw new UnauthorizedException('Permission denied');
    }

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }

  async addPost(userId, postId) {
    const updateUser = await this.usersModel.findByIdAndUpdate(userId, {
      $push: { posts: postId },
    });
    return updateUser;
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
