import { Injectable } from '@nestjs/common';
import { HealthProfileQuestionaries, healthProfileQuestionariesService } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class HealthDataService {
    constructor(
    ) { }

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
}
