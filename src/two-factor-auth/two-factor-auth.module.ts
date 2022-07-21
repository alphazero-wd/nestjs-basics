import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService],
  imports: [UsersModule, AuthModule],
})
export class TwoFactorAuthModule {}
