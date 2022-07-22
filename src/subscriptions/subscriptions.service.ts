import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  async createMonthlySubscription(customerId: string) {
    const priceId = this.configService.get('MONTHLY_SUBSCRIPTION_PRICE_ID');
    const subscriptions = await this.stripeService.listSubscriptions(
      priceId,
      customerId,
    );
    if (subscriptions.data.length)
      throw new BadRequestException('Customer already subscribed');
    return this.stripeService.createSubscription(priceId, customerId);
  }

  async getMonthlySubscriptions(customerId: string) {
    const priceId = this.configService.get('MONTHLY_SUBSCRIPTION_PRICE_ID');
    const subscriptions = await this.stripeService.listSubscriptions(
      priceId,
      customerId,
    );
    if (!subscriptions.data.length)
      throw new BadRequestException('Customer not subscribed');
    return subscriptions.data[0];
  }
}
