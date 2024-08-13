import { Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { SurveyQuestions } from "../entities";
import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";

class SurveyQuestionsService {
  static get surveyQuestionsRepository(): Repository<SurveyQuestions> {
    return DatabaseModule.getRepository(SurveyQuestions);
  }

  async addSurveyQuestion(data: Partial<SurveyQuestions>): Promise<SurveyQuestions> {
    const surveyQuestion = new SurveyQuestions();
    Object.assign(surveyQuestion, data);
    await SurveyQuestionsService.surveyQuestionsRepository.save(surveyQuestion);
    return surveyQuestion;
  }

  async findSurveyQuestion(userId: string): Promise<SurveyQuestions[]> {
    return SurveyQuestionsService.surveyQuestionsRepository.find({
      where: { userId }
    });
  }

  async addSurveyQuestionAnswer(data: Partial<SurveyQuestions>): Promise<SurveyQuestions> {
    const surveyQuestion = new SurveyQuestions();
    const existingAnswer = await this.findActiveSurveyQuestionAnswer(data.userId, data.questionTag);
    if (existingAnswer) {
      data.answerVersion = existingAnswer.questionVersion + 1;
      existingAnswer.status = 'ARCHIVE';
      await SurveyQuestionsService.surveyQuestionsRepository.save({
        ...existingAnswer,
        updatedBy: data.updatedBy
      });
    }
    Object.assign(surveyQuestion, data);
    await SurveyQuestionsService.surveyQuestionsRepository.save(surveyQuestion);
    return surveyQuestion;
  }

  async findActiveSurveyQuestionAnswer(userId: string, questionTag: string): Promise<SurveyQuestions> {
    return SurveyQuestionsService.surveyQuestionsRepository.findOne({
      where: { status: 'ACTIVE', userId, questionTag }
    });
  }

  async findAllSurveyQuestionAnswerBySurveyType(surveyType: string): Promise<SurveyQuestions[]> {
    return SurveyQuestionsService.surveyQuestionsRepository.find({
      where: { surveyType, status: 'ACTIVE'}
    });
  }

  async findAllSurveyQuestionAnswer(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' },
    filter: GenericFilterDto = {},
  ): Promise<{ 
    data: SurveyQuestions[],
    totalRecords: number,
    limit: number,
    page: number,
  }> {
    const [data, totalRecords] = await SurveyQuestionsService.surveyQuestionsRepository.findAndCount({
      where: { ...filter },
      order: { [sorting.sortField]: sorting.sortOrder },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return { data, totalRecords, limit: pagination.limit, page: pagination.page };
  }

}

export const surveyQuestionsService = new SurveyQuestionsService();