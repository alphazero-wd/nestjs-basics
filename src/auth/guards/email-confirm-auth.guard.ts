import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from '../interfaces';

export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    if (!req.user.isEmailConfirmed)
      throw new UnauthorizedException('Please confirm your email.');
    return true;
  }
}
