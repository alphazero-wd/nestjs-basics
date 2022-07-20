import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts, {
    onDelete: 'CASCADE',
  })
  author: User;

  @Column('text', { array: true })
  paragraphs: string[];

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.id)
  comments: Comment[];
}