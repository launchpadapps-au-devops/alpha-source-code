import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { CreatePatientDetailsDto } from './patient.dto';
import { PolicyType } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class PatientService {
    private readonly userApiUrl: string;
    private readonly userApiPrefix: string;

    constructor(
        private readonly envConfigService: EnvConfigService,
        private readonly baseHttpService: BaseHttpService,
    ) {
        const { host: userApiUrl, port: userApiPrefix } = this.envConfigService.microservices.user;
        this.userApiUrl = userApiUrl;
        this.userApiPrefix = userApiPrefix;
    }

    async createPatientUserProfile(payload: CreatePatientDetailsDto, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient`,
            'POST',
            {
                ...payload,
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getPatientUserProfiles(query = {
        page: 1,
        limit: 10,
        searchKey: '',
        searchValue: '',
        sortField: 'createdAt',
        sortOrder: 'ASC' as 'ASC' | 'DESC',
    },
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient`,
            'GET',
            {},
            query,
            {
                'x-request-userId': reqUser.userId
            }
        );
    }


    async getPatientUserProfile(patientId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient/${patientId}`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async updatePatientUserProfile(patientId: string, payload: Partial<CreatePatientDetailsDto>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient/${patientId}`,
            'PUT',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async acceptTerms(patientId: string, policyType: PolicyType, version: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient/${patientId}/accept/${policyType}/${version}`,
            'PUT',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async revokeTermsAcceptance(patientId: string, policyType: PolicyType, version: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient/${patientId}/revoke/${policyType}/${version}/acceptance`,
            'PUT',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}
