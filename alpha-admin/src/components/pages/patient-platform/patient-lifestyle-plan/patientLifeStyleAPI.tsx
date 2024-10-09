import axios, { AxiosError } from "axios";
import { config } from "../../../../config/config";
import { Plan } from "../../lifestyle-plan/components/lifeStyleSlice";
import apiClient from "../../login/axios-setup";

interface PlansResponse {
    success: boolean;
    message: string;
    data: Plan[];
}

interface AssignPlanResponse {
    success: boolean;
    message: string;
    data: any; // Adjust this type according to your actual response data structure
}

export const getLifestylePlans = async (page = 1, limit = 10): Promise<PlansResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/plan?page=${page}&limit=${limit}`;

    try {
        const response = await apiClient.get<PlansResponse>(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Axios error, can handle specific error properties
            console.error('Error fetching lifestyle plans:', error.message);
        } else {
            // Generic error handling
            console.error('An unexpected error occurred:', error);
        }
        throw error; // Re-throw the error after logging
    }
};


export const assignLifestylePlan = async (userId: string, planId: string): Promise<AssignPlanResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/user-lifestyle-plan/assign`;

    try {
        const response = await apiClient.post<AssignPlanResponse>(apiURL, 
            { userId, planId },  // Include the request body with userId and planId
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Axios error, can handle specific error properties
            console.error('Error assigning lifestyle plan:', error.message);
        } else {
            // Generic error handling
            console.error('An unexpected error occurred:', error);
        }
        throw error; // Re-throw the error after logging
    }
};
