import axios from 'axios';
import { config } from '../../../config/config';

interface StepsPerDay {
    date: string;
    steps: number;
}

interface PatientDataOverview {
    steps: number;
    averageStepsPerDay: number;
    stepsPerDay: StepsPerDay[];
    sleep: number;
    averageSleepPerDay: number;
    energy: number;
    averageEnergyPerDay: number;
    calories: number;
    averageCaloriesPerDay: number;
}

export interface PatientDataOverviewResponse {
    statusCode: number;
    message: string;
    data: PatientDataOverview;
}

const getPatientDataOverview = async (
    id: string,
    fromDate: string,
    toDate: string
): Promise<PatientDataOverviewResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/data-analytics/patient-data/overview/${id}`;
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                fromDate,
                toDate,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getPatientDataOverview };
