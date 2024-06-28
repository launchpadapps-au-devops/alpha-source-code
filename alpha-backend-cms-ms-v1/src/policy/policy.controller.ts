import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { TermsConditions } from '@launchpadapps-au/alpha-shared';

@Controller('policy')
export class PolicyController {
    constructor(
        private readonly policyService: PolicyService
    ) { }

    @Post('/terms-conditions')
    async addT(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: TermsConditions
    ) {
        const data = await this.policyService.addTermsConditions(payload, { userId: reqUserId });
        return {
            message: 'Terms and conditions added successfully',
            data: {
                id: data.id
            },
        };
    }

    @Get('/terms-conditions')
    async getTermsConditions() {
        const data = await this.policyService.getTermsConditions();
        return {
            message: 'Terms and conditions fetched successfully',
            data
        };
    }
}
 