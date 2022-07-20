import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @Length(1, 64)
  @IsNotEmpty()
  @IsString()
  name: string;
}
