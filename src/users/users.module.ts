import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([User]), StripeModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
