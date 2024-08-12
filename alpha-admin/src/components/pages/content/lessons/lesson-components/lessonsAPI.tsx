import axios from 'axios';
import { config } from '../../../../../config/config';

interface Lesson {
    id: number;
    title: string;
    content: string;
}

interface LessonsResponse {
    success: boolean;
    message: string;
    data: Lesson[];
}

interface LessonResponse {
    success: boolean;
    message: string;
    data: Lesson;
}

const getLessons = async (): Promise<LessonsResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/lesson`;
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

const getLessonById = async (id: number): Promise<LessonResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/lesson/${id}`;
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

const addLesson = async (lesson: { title: string; content: string }): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/lesson`;
    try {
        const response = await axios.post(apiURL, lesson, {
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

const addLessonsBulk = async (lessons: { title: string; content: string }[]): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/lesson/bulk`;
    try {
        const response = await axios.post(
            apiURL,
            { lessons },
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

const updateLesson = async (
    id: number,
    lesson: { title: string; content: string }
): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/lesson/${id}`;
    try {
        const response = await axios.put(apiURL, lesson, {
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

export { getLessons, getLessonById, addLesson, addLessonsBulk, updateLesson };
