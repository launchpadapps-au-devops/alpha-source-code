import axios from "axios";
import { config } from "../../../../config/config";


export const onBoardingAssessment = async (id: any): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/health-data/questionaries?userId=${id}`;

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

export const getHealthCheckinResponse = async (userId: any, surveyType: string): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/health-data/survey-questions?surveyType=${surveyType}&userId=${userId}`;


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