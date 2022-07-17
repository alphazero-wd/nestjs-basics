import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post: Post) => post.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, (user: User) => user.comments)
  author: User;
}
