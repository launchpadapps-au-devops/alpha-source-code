import { sessionService } from '@launchpadapps-au/alpha-shared';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const isValidSession = await sessionService.validateSessionByToken(token);
    if (!isValidSession) {
      throw new UnauthorizedException('Session is invalid or expired');
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
