import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(registerDto.password, 12);
      const createdUser = await this.usersService.createUser({
        ...registerDto,
        password: hashedPassword,
      });
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await compare(password, hashedPassword);
    if (!isPasswordMatching)
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
  }

  getCookieWithAccessToken(sub: number) {
    const payload: TokenPayload = { sub };
    const expiresIn = this.configService.get('JWT_ACCESS_EXPIRATION_TIME');
    const secret = this.configService.get('JWT_ACCESS_SECRET');
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn + 's',
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  getCookieWithRefreshToken(sub: number) {
    const payload: TokenPayload = { sub };
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION_TIME');
    const secret = this.configService.get('JWT_REFRESH_SECRET');
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn + 's',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
    return { token, cookie };
  }

  getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
