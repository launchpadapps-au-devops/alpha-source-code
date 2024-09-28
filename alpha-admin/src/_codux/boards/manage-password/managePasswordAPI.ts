import axios from 'axios';
import { config } from '../../../config/config';

export const matchPassword = async (email: string, password: string) => {
  const response = await axios.post(`${config.BASE_URL}/gateway/v1/auth/user/password/match`, {
    email,
    password,
  });
  return response.data;
};
