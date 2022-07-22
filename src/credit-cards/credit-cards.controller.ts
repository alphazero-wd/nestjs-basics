import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { EmailConfirmationGuard } from '../auth/guards/email-confirm-auth.guard';
import { RequestWithUser } from '../auth/interfaces';
import { StripeService } from '../stripe/stripe.service';
import { AddCreditCardDto, SetDefaultCreditCardDto } from './dto';

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addCreditCard(
    @Body() { paymentMethodId }: AddCreditCardDto,
    @Req() req: RequestWithUser,
  ) {
    return this.stripeService.attachCreditCard(
      paymentMethodId,
      req.user.stripeCustomerId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  async getCreditCards(@Req() req: RequestWithUser) {
    return this.stripeService.listCreditCards(req.user.stripeCustomerId);
  }

  @Post('set-default')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async setDefaultCreditCard(
    @Body() { paymentMethodId }: SetDefaultCreditCardDto,
    @Req() req: RequestWithUser,
  ) {
    await this.stripeService.setDefaultCreditCard(
      paymentMethodId,
      req.user.stripeCustomerId,
    );
  }
}
