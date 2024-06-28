import { Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { ITermsConditionsService } from "../interfaces/ITermsConditionsService.interface";
import { TermsConditions } from "../entities/termsCondition.entity";

class TermsConditionsService implements ITermsConditionsService {
  static get termsConditionRepository(): Repository<TermsConditions> {
    return DatabaseModule.getRepository(TermsConditions);
  }

  async addTermsConditions(data: Partial<TermsConditions>): Promise<TermsConditions> {
    const termsConditions = new TermsConditions();

    const existingTermsConditions = await this.findActiveTermsConditions();
    if (existingTermsConditions) {
      data.version = existingTermsConditions.version + 1;
      existingTermsConditions.status = 'ARCHIVE';
      await TermsConditionsService.termsConditionRepository.save({
        ...existingTermsConditions,
        updatedBy: data.updatedBy
      });
    }

    Object.assign(termsConditions, data);
    await TermsConditionsService.termsConditionRepository.save(termsConditions);
    return this.findActiveTermsConditions();
  }

  async findActiveTermsConditions(): Promise<TermsConditions> {
    return TermsConditionsService.termsConditionRepository.findOne({
      where: { status: 'ACTIVE' }
    });
  }

}

export const termsConditionsService = new TermsConditionsService();