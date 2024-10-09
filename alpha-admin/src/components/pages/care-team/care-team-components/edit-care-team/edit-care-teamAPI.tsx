import axios from "axios";
import { config } from '../../../../../config/config';
import apiClient from "../../../login/axios-setup";

interface editStaffData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    roleId: string;
    permissions: Array<any>;
}

const editStaffService = async (id: string | undefined, data: editStaffData): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = `${config.BASE_URL}/gateway/v1/staff/${id}`;

    try {
        console.log('data', data);
        const response = await apiClient.put(apiURL, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        console.log('response', response.data);
        return response.data;
    } catch (error) {
        throw error;
        console.log('Error', error);
    }
};

export default editStaffService;
