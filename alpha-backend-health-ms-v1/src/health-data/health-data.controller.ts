import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { HealthDataService } from './health-data.service';
import { HealthProfileQuestionaries, SurveyQuestions } from '@launchpadapps-au/alpha-shared';

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

    @Post('/survey-questions')
    async addSurveyQuestionAnswer(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: Partial<SurveyQuestions>
    ) {
        const data = await this.healthDataService.addSurveyQuestionAnswer({
            ...payload,
            userId: reqUserId
        }, {
            userId: reqUserId
        });

        return {
            message: 'Survey question answer added successfully',
            data: {
                id: data.id
            },
        };
    }

    @Get('/survey-questions')
    async getActiveSurveyQuestionAnswer(
        @Headers('x-request-userId') reqUserId: string,
        @Query() query: any
    ) {
        const { limit = 10, page = 1, sortField = 'createdAt', sortOrder ='ASC', ...filter } = query;
        const data = await this.healthDataService.getActiveSurveyQuestionAnswer(
            {
                page: parseInt(page),
                limit: parseInt(limit)
            },
            {
                sortField,
                sortOrder
            },
            filter
        );

        return {
            message: 'Survey questions fetched successfully',
            data: data
        };
    }

}
 