import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  // use EventPattern in order not to wait for a response
  @MessagePattern('create-subscriber')
  create(@Payload() createSubscriberDto: CreateSubscriberDto) {
    return this.subscribersService.create(createSubscriberDto);
  }

  @MessagePattern('find-all-subscribers')
  findAll() {
    return this.subscribersService.findAll();
  }
}
