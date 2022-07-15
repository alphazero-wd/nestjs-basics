import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
import { mockedUser } from '../../utils/mocks/stub';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let app: INestApplication;
  let userData: User;

  beforeEach(async () => {
    userData = { ...mockedUser };
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', async () => {
        const expectedData = { ...userData };
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: userData.email,
            name: userData.name,
            password: 'randompassword',
          })
          .expect(201)
          .expect(expectedData);
      });
    });
  });

  describe('and using invalid data', () => {
    it('should throw an error', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: mockedUser.name,
        })
        .expect(400);
    });
  });
});
