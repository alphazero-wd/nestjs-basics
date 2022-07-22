import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { CreditCardsController } from './credit-cards.controller';

@Module({
  imports: [StripeModule],
  controllers: [CreditCardsController],
})
export class CreditCardsModule {}
