import * as crypto from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { StripeService } from '../stripe/stripe.service';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private stripeService: StripeService,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (user) return user;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async createUser(createUserDto: CreateUserDto) {
    const stripeCustomer = await this.stripeService.createCustomer(
      createUserDto.name,
      createUserDto.email,
    );
    const newUser = this.usersRepository.create({
      ...createUserDto,
      stripeCustomerId: stripeCustomer.id,
    });
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

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    await this.usersRepository.update(
      { id: userId },
      { currentHashedRefreshToken },
    );
  }

  async getUserByRefreshToken(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(
      { id: userId },
      { currentHashedRefreshToken: null },
    );
  }

  async enableTwoFactorAuth(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthEnabled: true,
    });
  }

  async setTwoFactorAuthSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, { twoFactorAuthSecret: secret });
  }

  async updateMonthlySubscriptionStatus(
    customerId: string,
    subscriptionStatus: string,
  ) {
    return this.usersRepository.update(
      {
        stripeCustomerId: customerId,
      },
      { monthlySubscriptionStatus: subscriptionStatus },
    );
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update({ email }, { isEmailConfirmed: true });
  }

  async markPhoneNumberAsConfirmed(userId: number) {
    return this.usersRepository.update(userId, {
      isPhoneNumberConfirmed: true,
    });
  }

  async createWithGoogle(email: string, name: string) {
    const stripeCustomer = await this.stripeService.createCustomer(name, email);
    const randomHash = await hash(crypto.randomBytes(32).toString('hex'), 12);
    const newUser = this.usersRepository.create({
      email,
      name,
      isRegisteredWithGoogle: true,
      password: randomHash,
      stripeCustomerId: stripeCustomer.id,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
