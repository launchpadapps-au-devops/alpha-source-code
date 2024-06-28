import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { Policy, PolicyType } from '@launchpadapps-au/alpha-shared';

@Controller('policy')
export class PolicyController {
    constructor(
        private readonly policyService: PolicyService
    ) { }

    @Post('/:type')
    async addPolicy(
        @Headers('x-request-userId') reqUserId: string,
        @Param('type') type: PolicyType,
        @Body() payload: Partial<Policy>
    ) {
        const data = await this.policyService.addPolicy({
            ...payload,
            type
        }, {
            userId: reqUserId
        });
        return {
            message: `Policy for ${type} has been added successfully`,
            data: {
                id: data.id
            },
        };
    }

    @Get('/:type')
    async getActivePolicy(
        @Param('type') type: PolicyType
    ) {
        const data = await this.policyService.findActivePolicy(type);
        return {
            message: `Policy for ${type} fetched successfully`,
            data
        };
    }
}
 