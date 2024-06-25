import { Injectable } from '@nestjs/common';
import { userService } from '@launchpadapps-au/alpha-shared';
import { CreatePatientDetailsDto } from './patient.dto';

@Injectable()
export class PatientService {
    constructor(
    ) { }

    async createPatientUserProfile(payload: CreatePatientDetailsDto) {
        return userService.createUser(payload);
    }
}
