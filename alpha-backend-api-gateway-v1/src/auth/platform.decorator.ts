import { SetMetadata } from '@nestjs/common';

export const Platforms = (...platforms: string[]) => SetMetadata('platforms', platforms);
