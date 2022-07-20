import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PaginationParams } from './params';
import { PostsService } from './posts.service';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams,
  ) {
    if (search) return this.postsService.searchPosts(search);
    return this.postsService.findAll(limit, offset, startId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    await this.postsService.remove(id);
    req.res.sendStatus(200);
  }
}
