import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), AuthModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
