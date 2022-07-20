import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentCommand } from '../commands';
import { Comment } from '../entities/comment.entity';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    const { postId, content } = command.comment;
    const newComment = this.commentsRepository.create({
      content,
      post: { id: postId },
      author: command.author,
    });
    await this.commentsRepository.save(newComment);
    return newComment;
  }
}
