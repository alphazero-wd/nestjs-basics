import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './entities/post.entity';
import {
  PostCountResult,
  PostSearchBody,
  PostSearchResult,
} from './interfaces/posts-search.interface';

@Injectable()
export default class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index<PostSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        paragraphs: post.paragraphs,
        authorId: post.author.id,
      },
    });
  }
  async count(query: string, fields: string[]) {
    const { body } = await this.elasticsearchService.count<PostCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return body.count;
  }

  async search(search: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(search, ['title', 'paragraphs']);
    }
    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            filter: { range: { id: { gt: startId } } },
            must: {
              multi_match: { query: search, fields: ['title', 'paragraphs'] },
            },
          },
        },
        sort: { id: { order: 'asc' } },
      },
    });
    const count = body.hits.total;
    const hits = body.hits.hits;
    return {
      count: startId ? separateCount : count,
      results: hits.map((item) => item._source),
    };
  }

  async update(post: Post) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      paragraphs: post.paragraphs,
      authorId: post.author.id,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: { inline: script },
      },
    });
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }
}
