import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(req.user, createCommentDto);
  }

  @Get()
  findAll(@Query('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findAll(postId);
  }
}
