import axios from 'axios';
import { config } from '../../../../../config/config';
import apiClient from '../../../login/axios-setup';

// Define the data structure for the response
interface StepsPerDay {
    date: string;
    steps: number;
}

interface NutritionData {
    calories: number;
    protien: number;
    carbs: number;
    fats: number;
}

export interface UserDataOverview {
    steps: number;
    averageStepsPerDay: number;
    stepsPerDay: StepsPerDay[];
    sleep: number;
    averageSleepPerDay: number;
    energy: number;
    averageEnergyPerDay: number;
    calories: number;
    averageCaloriesPerDay: number;
    nutritionData: NutritionData;
}

export interface UserDataOverviewResponse {
    statusCode: number;
    message: string;
    data: UserDataOverview;
}

// Function to get patient data overview
const getPatientDataOverview = async (patientId: string): Promise<UserDataOverviewResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/data-analytics/patient-data/overview/${patientId}`;

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

export { getPatientDataOverview };
