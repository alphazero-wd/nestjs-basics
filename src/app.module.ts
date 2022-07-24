import * as Joi from '@hapi/joi';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { CommentsModule } from './comments/comments.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { PostsModule } from './posts/posts.module';
import { SearchModule } from './search/search.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { UsersModule } from './users/users.module';
import { PubSubModule } from './pubsub/pubsub.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { StripeModule } from './stripe/stripe.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { SmsModule } from './sms/sms.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
    ScheduleModule.forRoot(),
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
        SUBSCRIBERS_SERVICE_HOST: Joi.string().required(),
        SUBSCRIBERS_SERVICE_PORT: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        GRPC_CONNECTION_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.string().required(),
        ELASTICSEARCH_USERNAME: Joi.string().required(),
        ELASTICSEARCH_PASSWORD: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_CURRENCY: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_SENDER_PHONE_NUMBER: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    SubscribersModule,
    CommentsModule,
    EmailModule,
    ChatModule,
    SearchModule,
    PubSubModule,
    TwoFactorAuthModule,
    StripeModule,
    CreditCardsModule,
    SubscriptionsModule,
    StripeWebhookModule,
    EmailConfirmationModule,
    SmsModule,
    GoogleAuthModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
