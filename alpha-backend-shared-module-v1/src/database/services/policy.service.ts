import { Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { IPolicyService } from "../interfaces/IPolicy.interface";
import { Policy } from "../entities/policy.entity";

class PolicyService implements IPolicyService {
  static get policyRepository(): Repository<Policy> {
    return DatabaseModule.getRepository(Policy);
  }

  async addPolicy(data: Partial<Policy>): Promise<Policy> {
    const policy = new Policy();

    const existingPolicy = await this.findActivePolicy(data.type);
    if (existingPolicy) {
      data.version = existingPolicy.version + 1;
      existingPolicy.status = 'ARCHIVE';
      await PolicyService.policyRepository.save({
        ...existingPolicy,
        updatedBy: data.updatedBy
      });
    }

    Object.assign(policy, data);
    await PolicyService.policyRepository.save(policy);
    return this.findActivePolicy(data.type);
  }

  async findActivePolicy(type: string): Promise<Policy> {
    return PolicyService.policyRepository.findOne({
      where: { status: 'ACTIVE', type }
    });
  }

}

export const policyService = new PolicyService();