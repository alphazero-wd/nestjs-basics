import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { StripeError } from './errors/stripe-error.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({ name, email });
  }

  async attachCreditCard(paymentMethodId: string, customerId: string) {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });
  }

  async charge(amount: number, paymentMethodId: string, customerId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      off_session: true,
      confirm: true,
    });
  }

  async listCreditCards(customerId: string) {
    return this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  async setDefaultCreditCard(paymentMethodId: string, customerId: string) {
    try {
      return this.stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    } catch (error) {
      if (error?.type === StripeError.InvalidRequest)
        throw new BadRequestException('Wrong credit card provided');
      throw new InternalServerErrorException();
    }
  }

  async createSubscription(priceId: string, customerId: string) {
    try {
      return this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: 30,
      });
    } catch (error) {
      if (error?.code === StripeError.ResourceMissing)
        throw new BadRequestException('Credit card not set up');
      throw new InternalServerErrorException();
    }
  }

  async listSubscriptions(priceId: string, customerId: string) {
    return this.stripe.subscriptions.list({
      price: priceId,
      customer: customerId,
      expand: ['data.latest_invoice', 'data.latest_invoice.payment_intent'],
    });
  }

  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
