import { CreateSubscriberDto } from '../dto/create-subscriber.dto';
import { Subscriber } from './subscriber.service';

interface SubscribersService {
  createSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  getAllSubscribers(params: {}): Promise<{ data: Subscriber[] }>;
}

export default SubscribersService;
