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
import { Post } from '../../posts/entities/post.entity';
import { Address } from './address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

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

  @OneToMany(() => Post, (post: Post) => post.author, { onDelete: 'CASCADE' })
  posts?: Post[];

  @OneToMany(() => Comment, (comment: Comment) => comment.id, {
    onDelete: 'CASCADE',
  })
  comments?: Comment[];

  @OneToMany(() => Message, (message: Message) => message.author, {
    onDelete: 'CASCADE',
  })
  messages?: Message[];
}
