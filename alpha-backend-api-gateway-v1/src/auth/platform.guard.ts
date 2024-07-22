import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PlatformGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const platforms = this.reflector.get<string[]>('platforms', context.getHandler());
    if (!platforms) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return platforms.includes(user.platform);
  }
}
