import axios from "axios";
import { config } from "../../../config/config";
import { CreatePatientData } from "./create-patient/create-patient";
import { EditPatientData } from "./edit-patient/editPatient";
import apiClient from "../login/axios-setup";

export interface MetaData {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    sortField: string;
}

export interface Patient {
    firstName: string;
    lastName: string;
    profilePicture: string;
    phone: string;
    email: string;
    gender: string;
    dob: string;
    address: string;
    height: number;
    heightUnit: string;
    weight: number;
    weightUnit: string;
    bmi: number;
    patientDetailsEditConsent: boolean;
    platform: string;
    termsVersion: number;
    dataConsentVersion: number;
    isOnboardingHealthQuestionariesCompleted: boolean;
    userType: string;
    id: string;
    isPasswordSet: boolean;
    planName: string;
}

export interface PatientsResponse {
    id: any;
    statusCode: number;
    message: string;
    data: Patient[] | any;
    meta: MetaData;
}

export const getPatients = async (
    page: number = 1,
    limit: number = 10,
    sortField: string = '',
    searchKey?: string,
    searchValue?: string
): Promise<PatientsResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    let apiURL = `${config.BASE_URL}/gateway/v1/patient?page=${page}&limit=${limit}`;

    // Add search parameters if provided
    if (searchKey && searchValue) {
        apiURL += `&searchKey=${searchKey}&searchValue=${searchValue}`;
    }

    try {
        const response = await apiClient.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as PatientsResponse;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

// Update your getPatients function



// Update your getPatients function



export const addPatientAPI = async (patientData: CreatePatientData): Promise<PatientsResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/patient`;

    try {
        const response = await apiClient.post(apiURL, patientData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as any;
    } catch (error) {
        throw error;
    }
};

export const getPatientProfile = async (id: any): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/patient/${id}`;

    try {
        const response = await apiClient.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as any;
    } catch (error) {
        throw error;
    }
};

export const sentInvite = async (id: any): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/patient/${id}/invite`;

    try {
        const response = await apiClient.post(apiURL,{}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as any;
    } catch (error) {
        throw error;
    }
};

// Function to update patient details
export const updatePatientProfile = async (patientData: EditPatientData , id:string) => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/patient/${id}`;

    try {
        const response = await apiClient.put(apiURL, patientData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
