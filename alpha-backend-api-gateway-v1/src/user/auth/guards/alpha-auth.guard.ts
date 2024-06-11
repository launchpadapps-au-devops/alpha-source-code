import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthStrategy as AuthStrategyType } from "../../../enum/auth/auth-strategy";
import { AuthStrategy } from "../decorators/auth-strategy.decorator";
import { AuthUtil, userService } from "@launchpadapps-au/alpha-shared";
import { RequesterDetails } from "../../../common/interfaces/request.interface";
import { Permissions } from '../decorators/permissions.decorator';

@Injectable()
export class AlphaAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requesterDetails = request.user as RequesterDetails;
    const user = await userService.findUserById(requesterDetails.userId);

    const authStrategy = this.reflector.get<AuthStrategyType>(AuthStrategy, context.getHandler());
    const permissionName = this.reflector.get<PermissionName>(Permissions, context.getHandler());

    if (!authStrategy) {
        throw new InternalServerErrorException('Please define an auth strategy for this route');
    }

    switch (authStrategy) {
        case 'patient':
            if (permissionName) {
                throw new InternalServerErrorException('Please do not supply permissions if the auth strategy is patient');
            }
            return AuthUtil.isUserAPatient(user);
        case 'permission based':
            return user.permission.name === permissionName;
        default:
            throw new InternalServerErrorException('Auth strategy not implemented or invalid');
    }
  }
}