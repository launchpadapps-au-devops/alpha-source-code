import axios from 'axios';
import { config } from '../../../../config/config';

interface Tip {
    data: any;
    id: number;
    tip: string;
    date: string;
}

interface TipsResponse {
    success: boolean;
    message: string;
    data: Tip[];
}

interface TipResponse {
    success: boolean;
    message: string;
    data: Tip;
}

const getTips = async (page: any): Promise<TipsResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/daily-tip?page=${page}`;
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

const getTipByDay = async (day: string): Promise<TipResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/daily-tip/${day}`;
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

const addTip = async (tip: any): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/daily-tip`;
    try {
        const response = await axios.post(
            apiURL,
            { dailyTipData: tip },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log('response', response.data);
        return response.data;
    } catch (error) {
        throw error;
        console.log('Error', error);
    }
};

export { getTips, getTipByDay, addTip };
