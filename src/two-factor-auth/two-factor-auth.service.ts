import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async generateTwoFactorAuthSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.usersService.setTwoFactorAuthSecret(secret, user.id);
    return { secret, otpAuthUrl };
  }

  pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
