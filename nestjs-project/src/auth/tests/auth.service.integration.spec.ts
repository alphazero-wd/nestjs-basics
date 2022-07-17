import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import {
  mockedConfigService,
  mockedJwtService,
} from '../../utils/mocks/services';
import { AuthService } from '../auth.service';
import { mockedUser } from '../../utils/mocks/stub';

jest.mock('bcrypt');

describe('AuthService', () => {
  let userData: User;
  let bcryptCompare: jest.Mock;
  let findUser: jest.Mock;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    userData = { ...mockedUser };
    findUser = jest.fn().mockResolvedValue(userData);

    // mock bcrypt
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const usersRepository = {
      findOne: findUser,
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        UsersService,
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  describe('when accessing data of authenticated user', () => {
    describe('when provided password is invalid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        await expect(
          authService.validateUser('user@email.com', 'randompassword'),
        ).rejects.toThrow();
      });
    });

    describe('when provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });

        it('should return the user', async () => {
          await expect(
            authService.validateUser('user@email.com', 'randompassword'),
          ).resolves.toEqual(userData);
        });
      });

      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it('should return the user', async () => {
          await expect(
            authService.validateUser('user@email.com', 'randompassword'),
          ).rejects.toThrow();
        });
      });
    });
  });
});
