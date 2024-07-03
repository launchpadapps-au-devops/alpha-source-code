import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { HealthDataService } from './health-data.service';
import { HealthProfileQuestionaries } from '@launchpadapps-au/alpha-shared';

@Controller('health-data')
export class HealthDataController {
    constructor(
        private readonly healthDataService: HealthDataService
    ) { }

    @Post('/questionaries')
    async addHealthProfileQuestionaries(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: Partial<HealthProfileQuestionaries>
    ) {
        const data = await this.healthDataService.addHealthProfileQuestionaries({
            ...payload
        }, {
            userId: reqUserId
        });

        return {
            message: 'Health profile questionaries added successfully',
            data: {
                id: data.id
            },
        };
    }

    @Get('/questionaries')
    async getHealthProfileQuestionaries(
        @Headers('x-request-userId') reqUserId: string,
        @Query() query: any
    ) {
        const data = await this.healthDataService.getHealthProfileQuestionaries(reqUserId);

        return {
            message: 'Health profile questionaries fetched successfully',
            data: data
        };
    }
}
 