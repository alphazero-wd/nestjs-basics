import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTwoFactorAuth extends AuthGuard('jwt-two-factor-auth') {}
