import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Address } from '../entities/address.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  address: Address;
}
