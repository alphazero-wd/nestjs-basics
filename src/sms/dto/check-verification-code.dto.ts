import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CheckVerificationCodeDto {
  @IsNumberString()
  @IsNotEmpty()
  @Length(4, 10)
  verificationCode: string;
}
