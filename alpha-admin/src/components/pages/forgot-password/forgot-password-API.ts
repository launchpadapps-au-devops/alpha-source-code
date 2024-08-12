
import axios from 'axios';
import { config } from '../../../config/config';

interface ForgotPasswordDataResponse {
    user: {
        email: string;
    };
    accessToken: string;
}

export async function forgotPassword(email: string): Promise<{ data: ForgotPasswordDataResponse }> {
    const response = await axios.post(
        `${config.BASE_URL}/api/v1/auth/forgot-password`,
        { email },
        {
            headers: {
                'Content-Type': 'application/json',
                'ollie-x-user-type': 'admin',
                'ollie-x-user-platform': 'web-practice-management',
                'ngrok-skip-browser-warning': true,
            },
        }
    );
    return response.data;
}