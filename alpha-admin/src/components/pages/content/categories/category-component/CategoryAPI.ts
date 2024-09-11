import axios from 'axios';
import { config } from '../../../../../config/config';

interface Category {
    id: number;
    name: string;
    description: string;
}

interface CategoriesResponse {
    success: boolean;
    message: string;
    data: Category[];
}

interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category;
}

const getCategories = async (page: any): Promise<CategoriesResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/category?page=${page}&limit=10`;
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

const getCategoriesForLesson = async (limit: any): Promise<CategoriesResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/category?limit=${limit}`;
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

const getCategoryById = async (id: number): Promise<CategoryResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/category/${id}`;
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

const addCategory = async (category: { name: string; description: string }): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/category`;
    try {
        const response = await axios.post(apiURL, category, {
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

const addCategoriesBulk = async (
    categories: { name: string; description: string }[]
): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/category/bulk`;
    try {
        const response = await axios.post(
            apiURL,
            { categories },
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

const updateCategory = async (
    id: number,
    category: { name: string; description: string }
): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/category/${id}`;
    try {
        const response = await axios.put(apiURL, category, {
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

export { getCategories, getCategoriesForLesson, getCategoryById, addCategory, addCategoriesBulk, updateCategory };
