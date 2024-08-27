import axios, { AxiosError } from "axios";
import { config } from "../../../../config/config";
import { Plan } from "../../lifestyle-plan/components/lifeStyleSlice";

interface PlansResponse {
    success: boolean;
    message: string;
    data: Plan[];
}

export const getLifestylePlans = async (page = 1, limit = 10): Promise<PlansResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/plan?page=${page}&limit=${limit}`;

    try {
        const response = await axios.get<PlansResponse>(apiURL, {
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
