import { Request, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { HealthDataService } from './health-data.service';
import { CreateHealthProfileQuestionariesDto, GetHealthProfileQuestionariesDto } from './health-data.dto';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Health Questionaries')
@ApiExtraModels(GetHealthProfileQuestionariesDto)
@Controller('health-data')
export class HealthDataController {
    constructor(
        private readonly healthDataService: HealthDataService,
        private readonly messageService: MessagingService
    ) { }

    // @ApiBearerAuth()
    // @ApiBody({ type: CreateHealthProfileQuestionariesDto })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Health profile questionaries added successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
   // @UseGuards(JwtAuthGuard)
    @Post('/questionaries')
    async createPatientUserProfile(
        @Request() req,
        @Body() payload: CreateHealthProfileQuestionariesDto
    ): Promise<object> {
        return await this.healthDataService.addHealthProfileQuestionaries(payload, req.user);
    }

    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Health profile questionaries fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(GetHealthProfileQuestionariesDto) }
                },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('/questionaries')
    async getHealthProfileQuestionaries(
        @Request() req
    ): Promise<object> {
        return await this.healthDataService.getHealthProfileQuestionaries(req.user);
    }
}
