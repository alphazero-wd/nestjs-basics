import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { UsersService } from '../users/users.service';
import { TwoFactorAuthCodeDto } from './dto/two-factor-auth.dto';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Req() req: RequestWithUser, @Res() res: Response) {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(req.user);
    return this.twoFactorAuthService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @Post('enable')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async enableTwoFactorAuth(
    @Req() req: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid =
      await this.twoFactorAuthService.isTwoFactorAuthCodeValid(
        twoFactorAuthCode,
        req.user,
      );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.usersService.enableTwoFactorAuth(req.user.id);
  }

  @Post('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async me(
    @Req() req: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid =
      await this.twoFactorAuthService.isTwoFactorAuthCodeValid(
        twoFactorAuthCode,
        req.user,
      );

    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    const accessTokenCookie = this.authService.getCookieWithAccessToken(
      req.user.id,
      true,
    );

    req.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return req.user;
  }
}
