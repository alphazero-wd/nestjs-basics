import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { CreateChargeDto } from './dto/create-charge.dto';
import { StripeService } from './stripe.service';

@Controller('charge')
export class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCharge(
    @Body() { amount, paymentMethodId }: CreateChargeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.stripeService.charge(
      amount,
      paymentMethodId,
      req.user.stripeCustomerId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCreditCards(@Req() req: RequestWithUser) {
    return this.stripeService.listCreditCards(req.user.stripeCustomerId);
  }
}
