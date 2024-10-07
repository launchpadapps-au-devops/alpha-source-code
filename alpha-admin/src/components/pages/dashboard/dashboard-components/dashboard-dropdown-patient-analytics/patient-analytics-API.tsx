import axios from "axios";
import { config } from "../../../../../config/config";

// Function to normalize the gender value
const normalizeGender = (gender: string): string => {
    if (gender.toLowerCase() === "non-binary" || gender.toLowerCase() === "non binary") {
        return "Non Binary"; // Change the gender to the expected format
    }
    return gender;
};

// Function to fetch patient data based on gender
export const fetchPatientsDataByGender = async (gender?: string): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const today = new Date().toISOString().split('T')[0];
    const fromDate = '2024-09-02'; // Adjust this date as needed

    let apiURL = `${config.BASE_URL}/gateway/v1/data-analytics/enrollements?toDate=${today}&fromDate=${fromDate}`;

    // Add gender to the URL if provided and it's not "All"
    if (gender && gender !== 'All') {
        const normalizedGender = normalizeGender(gender);
        const encodedGender = encodeURIComponent(normalizedGender);
        apiURL += `&gender=${encodedGender}`;
    }

    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching patients data by gender:', error.message);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error;
    }
};

// Function to fetch patient data based on lifestyle plan
export const fetchPatientsDataByPlan = async (planId?: number): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const today = new Date().toISOString().split('T')[0];
    const fromDate = '2024-09-02'; // Adjust this date as needed

    // Construct the API URL for fetching data based on the plan
    let apiURL = `${config.BASE_URL}/gateway/v1/data-analytics/lifestyle-plan?toDate=${today}&fromDate=${fromDate}`;
    
    // Add planId to the URL if provided
    if (planId) {
        apiURL += `&planId=${planId}`;
    }

    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching patients data by plan:', error.message);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error;
    }
};
