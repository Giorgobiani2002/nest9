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
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAuthGuard } from 'src/auth/auth.guard';
import { Role } from './role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { User } from './users.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard, RoleGuard)
  update(
    @Role() role,
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(role, req.userId, id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Req() request, @Param('id') id: string) {
    const { role, userId } = request.user;

    if (role !== 'admin' && userId !== id) {
      throw new UnauthorizedException('Permission denied');
    }

    return this.usersService.remove(role, userId, id);
  }
}
