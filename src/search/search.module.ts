import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
