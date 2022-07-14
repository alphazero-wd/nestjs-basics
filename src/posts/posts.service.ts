import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create(createPostDto);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  findAll() {
    return this.postsRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (post) return post;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);
    const post = await this.postsRepository.findOne({ where: { id } });
    if (post) return post;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const result = await this.postsRepository.delete(id);
    if (!result.affected)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
