import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDetailsDto } from './patient.dto';
import { PolicyType } from '@launchpadapps-au/alpha-shared';

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService
    ) { }

    @Post()
    async createPatientUserProfile(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: CreatePatientDetailsDto
    ) {
        const patient = await this.patientService.createPatientUserProfile(payload, { userId: reqUserId });
        return {
            message: `Patient ${payload.firstName} ${payload.lastName} has been added successfully`,
            data: {
                id: patient.id,
            },
            meta: {}
        };
    }

    @Get('/')
    async getPatientUserProfiles(
        @Headers('x-request-userId') reqUserId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('searchKey') searchKey: string = '',
        @Query('searchValue') searchValue: string = '',
        @Query('sortField') sortField?: string,
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    ) {
        const response = await this.patientService.getPatientUserProfiles({
            page: Number(page),
            limit: Number(limit),
            searchKey,
            searchValue,
            sortField: sortField || 'createdAt',
            sortOrder: sortOrder || 'ASC',
        });

        return {
            message: 'Patients fetched successfully',
            data: response.data,
            meta: {
                page: response.page,
                limit: response.limit,
                totalRecords: response.totalRecords,
                totalPages: Math.ceil(response.totalRecords / response.limit)
            }
        };
    }

    @Get('/:patientId')
    async getPatientUserProfile(
        @Headers('x-request-userId') reqUserId: string,
        @Param('patientId') patientId: string
    ) {
        const patient = await this.patientService.getPatientUserProfile(patientId);
        return {
            message: 'Patient fetched successfully',
            data: patient,
            meta: {}
        };
    }

    @Put('/:patientId')
    async updatePatientUserProfile(
        @Headers('x-request-userId') reqUserId: string,
        @Param('patientId') patientId: string,
        @Body() payload: CreatePatientDetailsDto,
    ) {
        const patient = await this.patientService.updatePatientUserProfile(patientId, payload);
        return {
            message: `Patient ${patient.firstName} ${patient.lastName} has been updated successfully`,
            data: {
                id: patient.id,
            },
            meta: {}
        };
    }

    @Put('/:patientId/accept/:policyType/:version')
    async acceptTerms(
        @Headers('x-request-userId') reqUserId: string,
        @Param('patientId') patientId: string,
        @Param('policyType') policyType: PolicyType,
        @Param('version') version: string
    ) {
        await this.patientService.acceptTerms(patientId, policyType, version, { userId: reqUserId });
        return {
            message: `Patient ${patientId} has accepted terms of ${policyType} version ${version}`,
            data: {},
            meta: {}
        };
    }

    @Put('/:patientId/revoke/:policyType/:version/acceptance')
    async revokeTermsAcceptance(
        @Headers('x-request-userId') reqUserId: string,
        @Param('patientId') patientId: string,
        @Param('policyType') policyType: PolicyType,
        @Param('version') version: string
    ) {
        await this.patientService.revokeTermsAcceptance(patientId, policyType, version, { userId: reqUserId });
        return {
            message: `Patient ${patientId} has revoked acceptance on terms of ${policyType} version ${version}`,
            data: {},
            meta: {}
        };
    }
}
 