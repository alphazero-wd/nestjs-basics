import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
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

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

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
    return this.postsService.create(createPostInput, context.req.user);
  }
}
