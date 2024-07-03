import { Repository } from "typeorm";
import { DatabaseModule } from "../index";
// import { IPolicyService } from "../interfaces/IPolicy.interface";
import { HealthProfileQuestionaries } from "../entities/HealthProfileQuestionaries.entity";

class  HealthProfileQuestionariesService {
  static get healthProfileQuestionariesRepository(): Repository<HealthProfileQuestionaries> {
    return DatabaseModule.getRepository(HealthProfileQuestionaries);
  }

  async addHealthQuestionAnswer(data: Partial<HealthProfileQuestionaries>): Promise<HealthProfileQuestionaries> {
    const healthProfile = new HealthProfileQuestionaries();

    const existingAnswer = await this.findActiveHealthQuestionAnswer(data.userId, data.questionTag);
    if (existingAnswer) {
      data.answerVersion = existingAnswer.questionVersion + 1;
      existingAnswer.status = 'ARCHIVE';
      await HealthProfileQuestionariesService.healthProfileQuestionariesRepository.save({
        ...existingAnswer,
        updatedBy: data.updatedBy
      });
    }


    Object.assign(healthProfile, data);
    await HealthProfileQuestionariesService.healthProfileQuestionariesRepository.save(healthProfile);
    return healthProfile;
  }

  async findActiveHealthQuestionAnswer(userId: string, questionTag: string): Promise<HealthProfileQuestionaries> {
    return HealthProfileQuestionariesService.healthProfileQuestionariesRepository.findOne({
      where: { status: 'ACTIVE', userId, questionTag }
    });
  }

  async findAllHealthQuestionAnswer(userId: string): Promise<HealthProfileQuestionaries[]> {
    return HealthProfileQuestionariesService.healthProfileQuestionariesRepository.find({
      where: { userId, status: 'ACTIVE'}
    });
  }
}

export const healthProfileQuestionariesService = new HealthProfileQuestionariesService();