import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { CheckVerificationCodeDto } from './dto/check-verification-code.dto';
import { SmsService } from './sms.service';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('init-verification')
  @UseGuards(JwtAuthGuard)
  async initPhoneNumberVerification(@Req() req: RequestWithUser) {
    if (req.user.isPhoneNumberConfirmed)
      throw new BadRequestException('Phone number already confirmed');
    await this.smsService.initPhoneNumberVerification(req.user.phoneNumber);
  }

  @Post('check-verification-code')
  @UseGuards(JwtAuthGuard)
  async checkVerificationCode(
    @Req() { user }: RequestWithUser,
    @Body() { verificationCode }: CheckVerificationCodeDto,
  ) {
    if (user.isPhoneNumberConfirmed)
      throw new BadRequestException('Phone number already confirmed');
    await this.smsService.confirmPhoneNumber(
      user.id,
      user.phoneNumber,
      verificationCode,
    );
  }
}
