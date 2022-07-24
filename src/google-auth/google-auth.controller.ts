import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { GoogleAuthService } from './google-auth.service';
@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  async me(@Body() { token }: TokenVerificationDto, @Req() req: Request) {
    const { accessTokenCookie, refreshTokenCookie, user } =
      await this.googleAuthService.auth(token);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }
}
