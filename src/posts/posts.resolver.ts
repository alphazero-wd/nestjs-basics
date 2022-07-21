import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { CreatePostInput } from './inputs/create-post.input';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { POST_ADDED_EVENT } from './constants';
import { PUB_SUB } from '../pubsub/pubsub.module';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    @Inject(PUB_SUB) private pubsub: RedisPubSub,
  ) {}

  @Subscription(() => Post)
  postAdded() {
    return this.pubsub.asyncIterator(POST_ADDED_EVENT);
  }

  // join poses a problem: we have to fetch both posts and author even if the client does not request it
  // therefore we can access the details about the query using @Info()
  // we also need to use it with graphql-parse-resolve-info package
  @Query(() => [Post])
  async posts(@Info() info: GraphQLResolveInfo) {
    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType,
    );
    const posts =
      'author' in simplifiedInfo.fields
        ? await this.postsService.findPostsWithAuthor()
        : await this.postsService.findAll();
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const newPost = await this.postsService.create(
      createPostInput,
      context.req.user,
    );
    await this.pubsub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }
}
