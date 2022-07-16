import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @Length(1, 64)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];
}
