import { Injectable } from '@nestjs/common';
import { SortingDto, userService } from '@launchpadapps-au/alpha-shared';
import { CreatePatientDetailsDto } from './patient.dto';

@Injectable()
export class PatientService {
    constructor(
    ) { }

    async createPatientUserProfile(payload: CreatePatientDetailsDto, reqUser = { userId: null }) {
        return userService.createUser({
            ...payload,
            createdBy: reqUser.userId
        });
    }

    #formatPatientData(patient) {
        return {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            gender: patient.gender,
            dob: patient.dob,
            address: patient.address,
            height: patient.height,
            heightUnit: patient.heightUnit,
            weight: patient.weight,
            weightUnit: patient.weightUnit,
            bmi: patient.bmi,
            patientDetailsEditConsent: patient.patientDetailsEditConsent,
            platform: patient.platform,
            userType: patient.userType,
            isPasswordSet: patient.isPasswordSet,
            isPasswordLinkSent: !!patient.password
        }
    }

    async getPatientUserProfiles(query = {
        page: 1,
        limit: 10,
        searchKey: '',
        searchValue: ''
    }) {
        const {
            data,
            totalRecords,
            limit,
            page
        } = await userService.findAllUsers(
            { limit: query.limit, page: query.page },
            {},
            { [query.searchKey]: query.searchValue }
        );

        return {
            data: data.map(patient => this.#formatPatientData(patient)),
            limit,
            page,
            totalRecords
        }
    }

    async getPatientUserProfile(patientId: string) {
        const patient = await userService.findUserById(patientId);
        return this.#formatPatientData(patient);
    }

    async updatePatientUserProfile(patientId: string, payload: CreatePatientDetailsDto, reqUser = { userId: null }) {
        return userService.updateUser(patientId, {
            ...payload,
            updatedBy: reqUser.userId
        });
    }

    async acceptTerms(patientId: string, termsVersion: string, reqUser = { userId: null }) {
        return userService.updateUser(patientId, {
            termsVersion: parseInt(termsVersion),
            updatedBy: reqUser.userId
        });
    }
}
