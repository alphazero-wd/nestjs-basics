import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import SubscribersService from './interfaces/subscribers.service.interface';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController implements OnModuleInit {
  private subscribersService: SubscribersService;
  constructor(@Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscribersService =
      this.client.getService<SubscribersService>('SubscribersService');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubscribers() {
    return this.subscribersService.getAllSubscribers({});
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSubscriber(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscribersService.createSubscriber(createSubscriberDto);
  }
}
