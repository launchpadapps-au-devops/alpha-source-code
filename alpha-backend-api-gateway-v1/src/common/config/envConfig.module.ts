import { Module } from '@nestjs/common';
import { EnvConfigService } from '../../common/config/envConfig.service';

@Module({
    providers: [EnvConfigService],
    exports: [EnvConfigService],
})
export class EnvConfigModule {}
