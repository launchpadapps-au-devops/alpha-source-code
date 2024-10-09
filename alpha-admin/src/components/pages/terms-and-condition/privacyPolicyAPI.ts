import axios from 'axios';
import { config } from '../../../config/config';
import apiClient from '../login/axios-setup';

// GET request to fetch terms and conditions
export const fetchPolicy = async (type: string) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await apiClient.get(`${config.BASE_URL}/gateway/v1/policy/${type}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching policy');
  }
};

// POST request to update terms and conditions
// POST request to update terms and conditions
export const postPolicy = async (policy: { type: string; content: { heading: string; body: string }[] }) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await apiClient.post(`${config.BASE_URL}/gateway/v1/policy`, policy, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error response:', error.response);
        throw new Error(error.response?.data?.message || 'Error updating policy');
    }
};
