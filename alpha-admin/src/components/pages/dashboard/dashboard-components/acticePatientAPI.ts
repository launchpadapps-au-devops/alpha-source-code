import axios from 'axios';
import { config } from '../../../../config/config';
import apiClient from '../../login/axios-setup';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    age: number;
}

export interface ActivePatientsResponse {
    statusCode: number;
    message: string;
    data: {
        users: User[];
        count: number;
    };
    meta: any;
}

const getActivePatients = async (): Promise<ActivePatientsResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/data-analytics/active-patients`;
    try {
        const response = await apiClient.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getActivePatients };
