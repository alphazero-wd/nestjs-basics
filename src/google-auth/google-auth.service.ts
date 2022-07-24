import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async auth(token: string) {
    const { email } = this.jwtService.decode(token) as any;
    try {
      const user = await this.usersService.getByEmail(email);
      // old users cannot login with google if they did not login with google before
      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) throw error;
      // if user is not found, create a new user with google registration
      return this.registerUser(token, email);
    }
  }

  async registerUser(token: string, email: string) {
    const userData = this.jwtService.decode(token) as any;
    const name = userData.name;
    const user = await this.usersService.createWithGoogle(email, name);
    return this.handleRegisteredUser(user);
  }

  async getCookiesForUser(user: User) {
    const accessTokenCookie = this.authService.getCookieWithAccessToken(
      user.id,
    );
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.authService.getCookieWithRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    return { accessTokenCookie, refreshTokenCookie };
  }

  async handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) throw new UnauthorizedException();
    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);
    return { accessTokenCookie, refreshTokenCookie, user };
  }
}
