import {
  CacheKey,
  CacheTTL,
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GET_POSTS_CACHE_KEY } from './constants/posts-cache-key.constant';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import PostsSearchService from './posts-search.service';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private postsSearchService: PostsSearchService,
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) this.cacheManager.del(key);
    });
  }

  async create(createPostDto: CreatePostDto, author: User) {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      author,
    });
    await this.postsRepository.save(newPost);
    await this.postsSearchService.indexPost(newPost);
    await this.clearCache();
    return newPost;
  }

  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
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
    if (post) {
      await this.clearCache();
      await this.postsSearchService.update(post);
      return post;
    }
    throw new PostNotFoundException(post.id);
  }

  async remove(id: number) {
    const result = await this.postsRepository.delete(id);
    if (!result.affected) throw new PostNotFoundException(id);
    await this.clearCache();
    await this.postsSearchService.remove(id);
  }

  async searchPosts(search: string) {
    const results = await this.postsSearchService.search(search);
    const ids = results.map((res) => res.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({
      where: { id: In(ids) },
    });
  }
}
