import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private lastPostId: number = 0;
  private posts: Post[] = [];
  create(createPostDto: CreatePostDto) {
    this.posts.push({
      id: ++this.lastPostId,
      ...createPostDto,
    });
    return this.posts.at(-1);
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const post = this.posts.find((post) => post.id === id);
    if (post) return post;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index > -1) {
      this.posts[index] = { ...this.posts[index], ...updatePostDto };
      return this.posts[index];
    } else throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index > -1) {
      this.posts.splice(index, 1);
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
