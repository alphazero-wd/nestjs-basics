import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { VerificationTokenPayload } from './interfaces/verify-token-payload.interface';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed)
      throw new BadRequestException('User already confirmed');
    await this.usersService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError')
        throw new BadRequestException('Email confirmation token expired');

      throw new BadRequestException('Bad confirmation token');
    }
  }

  sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    const html = `<p>Welcome to the application. To confirm the email address, click <a href=${url}>here</a>.</p>`;
    return this.emailService.sendEmail({
      to: email,
      subject: 'Email Confirmation',
      html,
    });
  }

  async resendVerificationLink(userId: number) {
    const user = await this.usersService.getById(userId);
    if (user.isEmailConfirmed)
      throw new BadRequestException('Email already confirmed');
    await this.sendVerificationLink(user.email);
  }
}
