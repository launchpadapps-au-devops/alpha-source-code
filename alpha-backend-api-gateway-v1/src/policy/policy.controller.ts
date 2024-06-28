import { Body, Controller, Get, Headers, Post, Request } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { TermsConditions } from '@launchpadapps-au/alpha-shared';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Policy')
@Controller('policy')
export class PolicyController {
    constructor(
        private readonly policyService: PolicyService
    ) { }

    @ApiBody({
        description: 'The payload for adding terms and conditions',
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            heading: { type: 'string', example: 'Introduction' },
                            body: { type: 'string', example: 'These are the terms and conditions...' },
                        },
                        required: ['heading', 'body'],
                    },
                },
            },
            required: ['content', 'status'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Terms and Condition added sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: '1' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })    
    @Post('/terms-conditions')
    async addTermsConditions(
        @Request() req,
        @Body() payload: Partial<TermsConditions>
    ) {
        return this.policyService.addTermsConditions(payload, req.user);
    }

    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Terms and Condition fetched sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: '1' },
                        version: { type: 'number', example: '1' },
                        content: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    heading: { type: 'string', example: 'Introduction' },
                                    body: { type: 'string', example: 'These are the terms and conditions...' },
                                },
                                required: ['heading', 'body'],
                            },
                        },
                        status: { type: 'string', enum: ['ACTIVE', 'ARCHIVE'], example: 'ACTIVE' },
                        createdAt: { type: 'string', format: 'date-time', example: '2021-09-01T00:00:00.000Z' },
                        createdBy: { type: 'string', example: '1' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2021-09-01T00:00:00.000Z' },
                        updatedBy: { type: 'string', example: '1' },

                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/terms-conditions')
    async getTermsConditions(
        @Request() req
    ) {
        return this.policyService.getTermsConditions();
    }
}
