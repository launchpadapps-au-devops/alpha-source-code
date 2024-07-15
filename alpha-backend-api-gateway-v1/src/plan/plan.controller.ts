import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan, SortOrderType } from '@launchpadapps-au/alpha-shared';
import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from './plan.dto';
import { ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { totalmem } from 'os';

@ApiTags('Plan')
@ApiExtraModels(CreatePlanDto, UpdatePlanDto, PlanResponseDto)
@Controller('plan')
export class PlanController {
    constructor(
        private readonly planService: PlanService
    ) { }


    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                planData: { type: 'object', $ref: getSchemaPath(CreatePlanDto) },
                themes: { type: 'array', example: [1, 2 ,3] },
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Plan created successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                    },
                },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post()
    async createPlan(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: {
            planData: Partial<Plan>
            themes: number[]
        }
    ) {
        const plan = await this.planService.createPlan(data);

        return {
            message: 'Plan created successfully',
            data: {
                id: plan.id
            },
            meta: {}
        };
    }

    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                planData: { type: 'object', $ref: getSchemaPath(UpdatePlanDto) },
                themes: { type: 'array', example: [1, 2 ,3] },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Plan updated successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                    },
                },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/:planId')
    async updatePlan(
        @Headers('x-request-userId') reqUserId: string,
        @Param('planId') planId: number,
        @Body() data: {
            planData: Partial<Plan>
            themes: number[]
        }
    ) {
        const plan = await this.planService.updatePlan(planId, data);

        return {
            message: 'Plan updated successfully',
            data: {
                id: plan.id
            },
            meta: {}
        };
    }

    @ApiQuery({ name: 'page', required: false, type: 'number' })
    @ApiQuery({ name: 'limit', required: false, type: 'number' })
    @ApiQuery({ name: 'sortField', required: false, type: 'string' })
    @ApiQuery({ name: 'sortOrder', required: false, type: 'string' })
    @ApiQuery({ name: 'searchText', required: false, type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Plans fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(PlanResponseDto) }
                },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        totalRecords: { type: 'number', example: 1 },
                        totalPages: { type: 'number', example: 1 },
                    },
                },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/')
    async getPlans(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string = 'updatedAt',
        @Query('sortOrder') sortOrder: SortOrderType = 'DESC',
        @Query('searchText') searchText: string = '',
    ) {
        const response = await this.planService.findAllPlans(
            {
                page,
                limit,
            },
            {
                sortField,
                sortOrder,
            },
            {
                searchText
            }
        );

        return {
            message: 'Plans fetched successfully',
            data: response.data,
            meta: {
                pagination: response.pagination,
                sorting: response.sorting
            }
        };
    }

    @ApiParam({ name: 'planId', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Plan fetched successfully' },
                data: { $ref: getSchemaPath(PlanResponseDto) },
                meta: {},
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:planId')
    async getPlanById(
        @Param('planId') planId: number
    ) {
        const plan = await this.planService.findPlanById(planId);

        return {
            message: 'Plan fetched successfully',
            data: plan,
            meta: {}
        };
    }
}
