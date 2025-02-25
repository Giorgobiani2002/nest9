import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
  };

  const userMock = {
    fullName: 'lasha',
    email: 'gela12345@gmail.com', // marto emails amowmebs
    role: 'user',
    subscriptionPlan: 'free',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('getByEmail', () => {
    it('correct email', async () => {
      mockUserModel.findOne.mockResolvedValue(userMock);

      const result = await usersService.getByEmail('gela12345@gmail.com');

      expect(result.email).toEqual('gela12345@gmail.com');
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'gela12345@gmail.com',
      });
    });

    it('bad request if email not have', async () => {
      mockUserModel.findOne.mockResolvedValue(null); 

      await expect(
        usersService.getByEmail('gela12345@gmail.com'),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'gela12345@gmail.com',
      });
    });
  });
});
