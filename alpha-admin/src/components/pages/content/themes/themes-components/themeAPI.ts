import axios from 'axios';
import { config } from '../../../../../config/config';
import apiClient from '../../../login/axios-setup';

interface Theme {
    id: number;
    name: string;
    description: string;
}

interface ThemesResponse {
    success: boolean;
    message: string;
    data: Theme[];
}

interface ThemeResponse {
    success: boolean;
    message: string;
    data: Theme;
}

const getThemes = async (page: any): Promise<ThemesResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/theme?page=${page}&limit=10`;
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

const getThemeById = async (id: number): Promise<ThemeResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/theme/${id}`;
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

const addTheme = async (theme: { name: string; description: string }): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/theme`;
    try {
        const response = await apiClient.post(apiURL, theme, {
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

const updateTheme = async (id: number, theme: any): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/theme/${id}`;
    try {
        const response = await apiClient.put(apiURL, theme, {
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

export { getThemes, getThemeById, addTheme, updateTheme };
