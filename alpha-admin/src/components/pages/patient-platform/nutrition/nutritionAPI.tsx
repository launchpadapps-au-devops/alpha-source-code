import axios from "axios";
import { config } from "../../../../config/config";

// Fetch nutrition data for a specific day (date in dd/MM/yyyy format)
export const nutritionAPI = async (id: string, fromDate: string, toDate: string): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/data-analytics/patient-data/overview/${id}?fromDate=${fromDate}&toDate=${toDate}`;

    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message || 'Error fetching data');
        } else {
            throw new Error('Network error or invalid request');
        }
    }
};
