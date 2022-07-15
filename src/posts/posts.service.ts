import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';
import { PostNotFoundException } from './exceptions/post-not-found.exception';

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
    throw new PostNotFoundException(post.id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);
    const post = await this.postsRepository.findOne({ where: { id } });
    if (post) return post;
    throw new PostNotFoundException(post.id);
  }

  async remove(id: number) {
    const result = await this.postsRepository.delete(id);
    if (!result.affected) throw new PostNotFoundException(id);
  }
}
