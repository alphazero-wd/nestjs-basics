import { Module } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { StripeService } from './stripe.service';

@Module({
  providers: [StripeService],
  controllers: [ChargeController],
  exports: [StripeService],
})
export class StripeModule {}
