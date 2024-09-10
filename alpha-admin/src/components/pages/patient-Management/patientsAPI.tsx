import axios from "axios";
import { config } from "../../../config/config";
import { CreatePatientData } from "./create-patient/create-patient";

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
    statusCode: number;
    message: string;
    data: Patient[];
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
        const response = await axios.get(apiURL, {
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
        const response = await axios.post(apiURL, patientData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as PatientsResponse;
    } catch (error) {
        throw error;
    }
};

export const getPatientProfile = async (id: string): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/patient/${id}`;

    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as any;
    } catch (error) {
        throw error;
    }
};
