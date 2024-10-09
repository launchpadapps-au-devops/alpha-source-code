import axios from 'axios';
import apiClient from '../login/axios-setup';
import { config } from '../../../config/config';


export const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/auth/logout`;

    try {
        const response = await apiClient.post(apiURL, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('response', response.data);
        return response.data;
    } catch (error) {
        console.error('Logout error', error);
        throw error;
    }
};
