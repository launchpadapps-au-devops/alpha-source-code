import axios from "axios";
import { config } from "../../../config/config";
import { CreatePatientData } from "./create-patient/create-patient";

export interface MetaData {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
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
}

export interface PatientsResponse {
    statusCode: number;
    message: string;
    data: Patient[];
    meta: MetaData;
}

export const getPatients = async (page: number = 1, limit: number = 10): Promise<PatientsResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/patient?page=${page}&limit=${limit}`; // Add limit to API URL

    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data as PatientsResponse;
    } catch (error) {
        console.error('Error fetching patients:', error); // Improved error logging
        throw error;
    }
};


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
