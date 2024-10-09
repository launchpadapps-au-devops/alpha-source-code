import axios from "axios";
import { config } from "../../../../config/config";
import apiClient from "../../login/axios-setup";

//http://dev.api.primaryx.com.au:3000/api/gateway/v1/user-lifestyle-plan/progress?userId=1d723c50-0457-43fa-a91b-f907c2f13121


export const gettingPlanProgress = async (id: any): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/user-lifestyle-plan/progress?userId=${id}`;

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