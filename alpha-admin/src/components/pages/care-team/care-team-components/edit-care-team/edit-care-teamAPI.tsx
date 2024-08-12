import axios from "axios";
import { config } from '../../../../../config/config';

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
    const apiURL = `${config.BASE_URL}/api/v1/user/${id}`;

    try {
        console.log('data', data);
        const response = await axios.patch(apiURL, data, {
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
