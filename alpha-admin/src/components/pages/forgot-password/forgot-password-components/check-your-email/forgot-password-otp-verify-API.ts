import axios from 'axios';
import { config } from '../../../../../config/config';

interface ForgotPasswordDataResponse {
    user: {
        email: string;
    };
    accessToken: string;
}

interface ForgotPasswordRequest {
    email: string;
    otp: number;
}

export async function forgotPasswordOtpVerify(data: ForgotPasswordRequest): Promise<{ data: ForgotPasswordDataResponse }> {
    const response = await axios.post(
        `${config.BASE_URL}/gateway/v1/auth/password/otp/verify`,
        { email: data.email, otp: data.otp },
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
