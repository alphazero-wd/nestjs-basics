import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @Length(1, 64)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  content: string;
}
