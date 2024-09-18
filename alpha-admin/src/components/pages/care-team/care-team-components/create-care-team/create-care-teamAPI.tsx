import axios from "axios";
import { config } from '../../../../../config/config';
// import { useSelector } from "react-redux";
// import { LoginUser } from "../../../../login/loginSlice";

interface staff {
    success: boolean;
    message: string;
    data: [];
}

const getStaff = async (page:any): Promise<staff> => {
    const accessToken = localStorage.getItem('accessToken');
    const token = 'token';
    let apiURL = `${config.BASE_URL}/gateway/v1/staff?page=${page}&limit=10`;
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getStaffRole = async (staffId: any): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');
    const token = 'token';
    let apiURL = `${config.BASE_URL}/gateway/v1/staff/${staffId}`;
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const inviteStaff = async (staffId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    let apiURL = `${config.BASE_URL}/gateway/v1/staff/${staffId}/invite`;
    try {
      const response = await axios.post(apiURL,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error sending staff invite');
    }
  };

export { getStaff, getStaffRole, inviteStaff };

interface staffFormData {
    userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleId: number ;
    }
    permissions: Array<any>;
}

const addNewStaffService = async (data: staffFormData): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    //const token = 'token';
    const apiURL = `${config.BASE_URL}/gateway/v1/staff`;

    // Set default password if not provided

    try {
        const response = await axios.post(apiURL, data, {
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


export default addNewStaffService;
