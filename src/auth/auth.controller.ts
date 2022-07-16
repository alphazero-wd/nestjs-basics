import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';
import { RequestWithUser } from './interfaces/request.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const user = req.user;
    const accessTokenCookie = this.authService.getCookieWithAccessToken(
      user.id,
    );
    const { token, cookie } = this.authService.getCookieWithRefreshToken(
      user.id,
    );
    // using res.setHeader can interfere with ClassSerializerInterceptor so we should use request.res.setHeader
    // explaination: https://github.com/nestjs/nest/issues/284#issuecomment-348639598
    await this.usersService.setCurrentRefreshToken(token, user.id);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: RequestWithUser) {
    const user = req.user;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  meRefresh(@Req() req: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithAccessToken(
      req.user.id,
    );
    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    await this.usersService.removeRefreshToken(req.user.id);
    req.res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
  }
}
