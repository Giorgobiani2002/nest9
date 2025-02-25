import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './auth.guard';
import { User } from 'src/users/users.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Req() request, @Body() signUpDto: SignUpDto) {
    const requestUserRole = request.user?.role || 'user';
    return this.authService.signUp(requestUserRole, signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@User() userId) {
    return this.authService.getCurrentUser(userId);
  }
}
