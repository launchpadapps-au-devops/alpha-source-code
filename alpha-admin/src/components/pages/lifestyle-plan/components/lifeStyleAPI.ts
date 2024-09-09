import axios from 'axios';
import { config } from '../../../../config/config';

interface Plan {
    id: any;
    name: string;
    description: string;
}

interface PlansResponse {
    success: boolean;
    message: string;
    data: Plan[];
}

interface PlanResponse {
    success: boolean;
    message: string;
    data: Plan;
}

const getPlans = async (page:any): Promise<PlansResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/plan?page=${page}&limit=10`;
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getPlanById = async (id: number): Promise<PlanResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/plan/${id}`;
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addPlan = async (plan: { name: string; description: string }): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/plan`;
    try {
        const response = await axios.post(apiURL, plan, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('response', response.data);
        return response.data;
    } catch (error) {
        throw error;
        console.log('Error', error);
    }
};

const updatePlan = async (
    id: number,
    plan: { name: string; description: string }
): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/plan/${id}`;
    try {
        const response = await axios.put(apiURL, plan, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('response', response.data);
        return response.data;
    } catch (error) {
        throw error;
        console.log('Error', error);
    }
};

export { getPlans, getPlanById, addPlan, updatePlan };
