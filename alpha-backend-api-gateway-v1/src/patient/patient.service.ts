import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { CreatePatientDetailsDto } from './patient.dto';

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

    async createPatientUserProfile(payload: CreatePatientDetailsDto) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient`,
            'POST',
            payload
        );
    }

    async getPatientUserProfiles(query = {
        page: 1,
        limit: 10,
        searchKey: '',
        searchValue: ''
    }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient`,
            'GET',
            {},
            query
        );
    }


    async getPatientUserProfile(patientId: string) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient/${patientId}`,
            'GET'
        );
    }

    async updatePatientUserProfile(patientId: string, payload: Partial<CreatePatientDetailsDto>) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/patient/${patientId}`,
            'PUT',
            payload
        );
    }
}
