
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
        `${config.BASE_URL}/gateway/v1/auth/password/otp`,
        { email },
        {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'alpha-x-platform': 'alpha-admin-web',
                'ngrok-skip-browser-warning': true,
            },
        }
    );
    return response.data;
}