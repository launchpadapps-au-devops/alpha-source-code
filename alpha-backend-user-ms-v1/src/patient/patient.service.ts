import { Injectable } from '@nestjs/common';
import { POLICY_TYPES, PolicyType, SortingDto, userPlanService, userService } from '@launchpadapps-au/alpha-shared';
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
            nickName: patient.nickName,
            planName: patient.plan?.name,
            planId: patient.plan?.d,
            startDate: patient.createdAt,
            totalPoint: patient.totalPoint,
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
            isPasswordLinkSent: !!patient.password,
            termsVersion: patient.termsVersion, 
            dataConsentVersion: patient.dataConsentVersion,
            isOnboardingHealthQuestionariesCompleted: patient.isOnboardingHealthQuestionariesCompleted,
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
            {
                ...(query.searchKey && query.searchValue ? [{ key: query.searchKey, value: query.searchValue }] : []),
                userType: 'patient'
            }
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
        const userPlan = await userPlanService.findUserPlansByUserId(patientId);
        return this.#formatPatientData({
            ...userPlan,
            ...patient,
        });
    }

    async updatePatientUserProfile(patientId: string, payload: CreatePatientDetailsDto, reqUser = { userId: null }) {
        return userService.updateUser(patientId, {
            ...payload,
            updatedBy: reqUser.userId
        });
    }

    async acceptTerms(patientId: string, type: PolicyType, version: string, reqUser = { userId: null }) {
        const updateData = { 
            updatedBy: reqUser.userId 
        };

        if(type === POLICY_TYPES.TERMS_AND_CONDITIONS) {
            updateData["termsVersion"] = parseInt(version);
        }

        if(type === POLICY_TYPES.DATA_CONSENT) {
            updateData["dataConsentVersion"] = parseInt(version);
        }

        return userService.updateUser(patientId, updateData);
    }

    async revokeTermsAcceptance(patientId: string, type: PolicyType, version: string, reqUser = { userId: null }) {
        const updateData = { 
            updatedBy: reqUser.userId 
        };

        if(type === POLICY_TYPES.TERMS_AND_CONDITIONS) {
            updateData["termsVersion"] = null;
        }

        if(type === POLICY_TYPES.DATA_CONSENT) {
            updateData["dataConsentVersion"] = null;
        }

        return userService.updateUser(patientId, updateData);
    }
}
