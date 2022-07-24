import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from '../../chat/entities/message.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { File } from '../../files/entities/file.entity';
import { Post } from '../../posts/entities/post.entity';
import { Address } from './address.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address?: Address;

  @OneToOne(() => File, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  avatar?: File;

  @Column({ nullable: true })
  avatarId?: number;

  @Column()
  stripeCustomerId: string;

  @Column({ nullable: true })
  monthlySubscriptionStatus?: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  isPhoneNumberConfirmed: boolean;

  @OneToMany(() => Post, (post: Post) => post.author, { onDelete: 'CASCADE' })
  posts?: Post[];

  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @Column({ default: false })
  isRegisteredWithGoogle: boolean;

  @OneToMany(() => Comment, (comment: Comment) => comment.id, {
    onDelete: 'CASCADE',
  })
  comments?: Comment[];

  @OneToMany(() => Message, (message: Message) => message.author, {
    onDelete: 'CASCADE',
  })
  messages?: Message[];
}
