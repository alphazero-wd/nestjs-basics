import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';
import { PostNotFoundException } from './exceptions/post-not-found.exception';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, author: User) {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      author,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async findAll(limit?: number, offset?: number, startId?: number) {
    // return posts and authors
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }
    const [items, count] = await this.postsRepository.findAndCount({
      relations: ['author'],
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
    });

    return { items, count: startId ? separateCount : count };
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });
    if (post) return post;
    throw new PostNotFoundException(post.id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });
    if (post) return post;
    throw new PostNotFoundException(post.id);
  }

  async remove(id: number) {
    const result = await this.postsRepository.delete(id);
    if (!result.affected) throw new PostNotFoundException(id);
  }
}