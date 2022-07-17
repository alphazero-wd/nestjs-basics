import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscriber } from './entities/subscriber.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscribersRepository: Repository<Subscriber>,
  ) {}
  async create(createSubscriberDto: CreateSubscriberDto) {
    const newSubscriber =
      this.subscribersRepository.create(createSubscriberDto);
    await this.subscribersRepository.save(newSubscriber);
    return newSubscriber;
  }

  findAll() {
    return this.subscribersRepository.find();
  }
}
