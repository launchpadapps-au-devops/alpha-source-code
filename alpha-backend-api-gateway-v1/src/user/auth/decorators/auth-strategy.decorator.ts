import { Reflector } from '@nestjs/core';
import { AuthStrategy as AuthStrategyType } from '../../../enum/auth/auth-strategy';

export const AuthStrategy = Reflector.createDecorator<AuthStrategyType>();