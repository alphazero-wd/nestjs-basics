import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../users/entities/user.entity';
import { CreateCommentCommand } from './commands';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQuery } from './queries';

@Injectable()
export class CommentsService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  create(user: User, createCommentDto: CreateCommentDto) {
    return this.commandBus.execute(
      new CreateCommentCommand(createCommentDto, user),
    );
  }

  findAll(postId: number) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
