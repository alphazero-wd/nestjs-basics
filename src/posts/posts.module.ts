import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SearchModule } from '../search/search.module';
import PostsSearchService from './posts-search.service';
import { PostsResolver } from './posts.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
    SearchModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService, PostsResolver],
})
export class PostsModule {}
