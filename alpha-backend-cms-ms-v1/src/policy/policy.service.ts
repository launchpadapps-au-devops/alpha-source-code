import { Injectable } from '@nestjs/common';
import { TermsConditions, termsConditionsService } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class PolicyService {
    constructor(
    ) { }

    async addTermsConditions(payload: TermsConditions, reqUser = { userId: null }) 
    {
        return termsConditionsService.addTermsConditions({
            ...payload,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });
    }
    
    async getTermsConditions() 
    {
        return termsConditionsService.findActiveTermsConditions();
    }
}
