import axios from 'axios';
import { config } from '../../../../../config/config';

export async function resetPassword(email: string, password: string, token: string): Promise<{ data: any }> {
    const response = await axios.put(
        `${config.BASE_URL}/gateway/v1/auth/password`,
        { password },
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
}
