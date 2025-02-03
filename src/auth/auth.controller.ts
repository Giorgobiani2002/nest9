import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto){
    return this.authService.signUp(signUpDto)
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto){
    return this.authService.signin(signInDto)
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@Req() req){
    return this.authService.getCurrentUser(req.userId)
  }
}
