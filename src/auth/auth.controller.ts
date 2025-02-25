import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './auth.guard';
import { User } from 'src/users/users.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiCreatedResponse({
    schema: {
      example: 'user registered successfully',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: 'user already exists',
    },
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JkNzIxOTU4ODBiNDAwN2FlNGZjMzAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDA0Njg4NjYsImV4cCI6MTc0MDQ3MjQ2Nn0.k_QU_bNcGh-kdG1DBG9B3sS_7zPkt20It_2KmCyltxo',
      },
    },
  })
  @Post('signup')
  async signUp(@Req() request, @Body() signUpDto: SignUpDto) {
    const requestUserRole = request.user?.role || 'user';
    return this.authService.signUp(requestUserRole, signUpDto);
  }

  @ApiBadRequestResponse({
    schema: {
      example: 'Email or Password is invalid',
    },
  })
  @ApiBearerAuth()
  
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
