import axios from "axios";
import { config } from "../../../../config/config";


export const onBoardingAssessment = async (id: any): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/v1/api-gateway/health-data/questionaries?userId=${id}`;

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