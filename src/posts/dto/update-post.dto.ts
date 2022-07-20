import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  @IsOptional()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @IsOptional()
  paragraphs: string[];
}
