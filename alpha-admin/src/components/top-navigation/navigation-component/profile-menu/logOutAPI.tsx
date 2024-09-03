import axios from 'axios';
import { config } from '../../../../config/config';

export const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/auth/logout`;

    try {
        const response = await axios.post(apiURL, {}, {
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
