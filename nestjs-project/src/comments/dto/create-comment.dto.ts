import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  postId: number;
}
