import { Reflector } from '@nestjs/core';
import { PermissionName } from '@launchpadapps-au/alpha-shared';

export const Permissions = Reflector.createDecorator<PermissionName>();