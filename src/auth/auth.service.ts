import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    requestUserRole: string,
    { email, fullName, password, role }: SignUpDto,
  ) {
    // Check if the user already exists
    const existUser = await this.userModel.findOne({ email });
    if (existUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    

    const newUser = await this.userModel.create({
      email,
      fullName,
      password: hashedPassword,
      role: role || 'user',
    });

    return { message: 'User registered successfully', user: newUser };
  }

  async signin({ email, password }: SignInDto) {
    const existUser = await this.userModel.findOne({ email });
    if (!existUser)
      throw new BadRequestException('Email or Password is invalid');

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual)
      throw new BadRequestException('Email or Password is invalid');

    const payLoad = {
      userId: existUser._id,
      role: existUser.role,
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
}
