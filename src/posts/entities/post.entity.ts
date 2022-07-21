import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => User)
  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts, {
    onDelete: 'CASCADE',
  })
  author: User;

  @Field(() => [String!]!)
  @Column('text', { array: true })
  paragraphs: string[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.id)
  comments: Comment[];
}
