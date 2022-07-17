import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentHandler, GetCommentsHandler } from './handlers';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CreateCommentHandler, GetCommentsHandler],
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
})
export class CommentsModule {}
