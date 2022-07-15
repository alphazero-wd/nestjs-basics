import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { mockedConfigService, mockedJwtService } from '../utils/mocks';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let findOne: jest.Mock;
  let authService: AuthService;
  beforeEach(async () => {
    findOne = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
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
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const sub = 1;
      expect(typeof authService.getCookieWithJwtToken(sub)).toBe('string');
    });
  });
});
