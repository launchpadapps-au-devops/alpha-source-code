import { Injectable } from '@nestjs/common';
import { Policy, PolicyType, policyService } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class PolicyService {
    constructor(
    ) { }

   async addPolicy(data: Partial<Policy>, reqUser = { userId: null }): Promise<Policy> {
    return policyService.addPolicy({
        ...data,
        createdBy: reqUser.userId,
        updatedBy: reqUser.userId
    });
   }

    async findActivePolicy(type: PolicyType): Promise<Policy> {
     return policyService.findActivePolicy(type);
    }
}
