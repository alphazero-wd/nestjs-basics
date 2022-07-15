import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (user) return user;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (user) return user;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
