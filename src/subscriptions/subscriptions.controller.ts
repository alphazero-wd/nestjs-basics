import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('monthly')
  @UseGuards(JwtAuthGuard)
  async createSubscription(@Req() req: RequestWithUser) {
    return this.subscriptionsService.createMonthlySubscription(
      req.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @UseGuards(JwtAuthGuard)
  async getSubscriptions(@Req() req: RequestWithUser) {
    return this.subscriptionsService.getMonthlySubscriptions(
      req.user.stripeCustomerId,
    );
  }
}
