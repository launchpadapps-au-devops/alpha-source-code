import { Injectable } from '@nestjs/common';
import { 
    GenericFilterDto,
    HealthProfileQuestionaries, 
    healthProfileQuestionariesService,
    PaginationDto,
    SortingDto,
    surveyQuestionsService,
    UserHealthData,
    userHealthDataService
} from '@launchpadapps-au/alpha-shared';
import { filter } from 'rxjs';

@Injectable()
export class HealthDataService {
    constructor(
    ) { }

    /** Health Questionary */
    async addHealthProfileQuestionaries(data: Partial<HealthProfileQuestionaries>, reqUser = { userId: null }) {
        return healthProfileQuestionariesService.addHealthQuestionAnswer({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });
    }

    async getHealthProfileQuestionaries( 
        userId: string
    ) {
        return healthProfileQuestionariesService.findAllHealthQuestionAnswer(userId);
    }

    /** Survey Data */
    async addSurveyQuestionAnswer(data: Partial<HealthProfileQuestionaries>, reqUser = { userId: null }) {
        return surveyQuestionsService.addSurveyQuestionAnswer({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });
    }

    async getActiveSurveyQuestionAnswer(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' },
        filter: GenericFilterDto = {}
    ) {
        return surveyQuestionsService.findAllSurveyQuestionAnswer(
            pagination,
            sorting,
            filter
        );
    }

    /** Health Data */
    async createHealthData(data: Partial<UserHealthData>, reqUser = { userId: null }) {
        return userHealthDataService.createUserHealthData({
            ...data,
            userId: reqUser.userId,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });
    }

    async bulkUpdateUserHealthData(data: Partial<UserHealthData>[], reqUser = { userId: null }) {
        return userHealthDataService.bulkUpdateUserHealthData(data.map(d => ({
            ...d,
            userId: reqUser.userId,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        })));
    }

    async getAllUserHealthData(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' },
        filter: GenericFilterDto = {}
    ) {
        return userHealthDataService.findAllUserHealthData(
            pagination,
            sorting,
            filter
        );
    }
}
