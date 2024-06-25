import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDetailsDto } from './patient.dto';

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService
    ) { }

    @Post()
    async createPatientUserProfile(
        @Body() payload: CreatePatientDetailsDto
    ) {
        const patient = await this.patientService.createPatientUserProfile(payload);
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
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('searchKey') searchKey: string = '',
        @Query('searchValue') searchValue: string = ''
    ) {
        const response = await this.patientService.getPatientUserProfiles({
            page: Number(page),
            limit: Number(limit),
            searchKey,
            searchValue
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
}
 