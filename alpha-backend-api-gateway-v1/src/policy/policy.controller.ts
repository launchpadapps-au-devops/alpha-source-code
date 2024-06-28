import { Body, Controller, Get, Headers, Param, Post, Request } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { POLICY_TYPES, Policy } from '@launchpadapps-au/alpha-shared';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


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
                type: { type: 'string', enum: Array(POLICY_TYPES), example: 'terms_conditions' },
                content: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            heading: { type: 'string', example: 'Introduction' },
                            body: { type: 'string', example: 'These are the terms and conditions...' },
                        },
                        required: ['heading', 'body',],
                    },
                },
            },
            required: ['content', 'type'],
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
    @Post('/')
    async addPolicy(
        @Request() req,
        @Body() payload: Partial<Policy>
    ) {
        return this.policyService.addPolicy(payload, req.user);
    }

    @ApiParam({
        name: 'type',
        description: 'The type of policy to fetch',
        required: true,
        type: 'string',
        enum: POLICY_TYPES
    })
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
                        type: { type: 'string', enum: Array(POLICY_TYPES), example: 'terms_conditions' },
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
    @Get('/:type')
    async getTermsConditions(
        @Request() req,
        @Param('type') type: string
    ) {
        return this.policyService.getActivePolicy(req.params.type);
    }
}
