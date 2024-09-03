
import axios from "axios";
import { config } from '../../../config/config';
import { LoginSliceState } from "./loginSlice";


export async function login(email: string, password: string): Promise<{ data: LoginSliceState }> {
    const response = await axios.post(
        `${config.BASE_URL}/gateway/v1/auth/login`,
        { email, password },
        {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'alpha-x-platform': 'alpha-admin-web',
                'ngrok-skip-browser-warning': true,
                'x-request-super-admin-token': '@su93r@dm1n'
            },
        }
    );
    return response.data;
}
