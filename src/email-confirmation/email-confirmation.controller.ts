import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import ConfirmEmailDto from './dto/confirm-email.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Body() { token }: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    return this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() req: RequestWithUser) {
    await this.emailConfirmationService.resendVerificationLink(req.user.id);
  }
}
