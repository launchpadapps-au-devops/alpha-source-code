import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const userTypes = this.reflector.get<string[]>('userTypes', context.getHandler());
    if (!userTypes) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return userTypes.includes(user.userType);
  }
}
