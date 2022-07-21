import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    private authService: AuthService,
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthToken(authToken);
    if (!user) throw new WsException('Invalid credentials.');
    return user;
  }

  async saveMessage(content: string, author: User) {
    const newMessage = this.messagesRepository.create({ content, author });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async getMessages() {
    return this.messagesRepository.find({ relations: ['author'] });
  }
}
