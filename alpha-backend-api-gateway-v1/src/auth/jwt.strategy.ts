import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
      passReqToCallback: true
    });
  }

  async validate(
    req: Request,
    payload: any,
  ) {
    const token = req.headers['authorization'].split(' ')[1];
    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, username: payload.username, userType: payload.userType };
  }
}
