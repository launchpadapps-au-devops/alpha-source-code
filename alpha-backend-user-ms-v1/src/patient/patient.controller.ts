import { Body, Controller, Post } from '@nestjs/common';
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
        return patient;
    }
}
 