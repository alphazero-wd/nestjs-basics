import { ClientProxy } from '@nestjs/microservices';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubscribers() {
    return this.subscribersService.send('find-all-subscribers', '');
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSubscriber(@Body() createSubscriberDto: CreateSubscriberDto) {
    // use emit with EventPattern
    // even though, it is more performant but we don't know if a subscriber is added successfully
    // therefore, we don't receive subscriber details
    return this.subscribersService.send(
      'create-subscriber',
      createSubscriberDto,
    );
  }
}
