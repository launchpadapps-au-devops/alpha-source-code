import axios from 'axios';
import { config } from '../../../config/config';
import apiClient from '../../../components/pages/login/axios-setup';

export const matchPassword = async (email: string, password: string) => {
  const response = await apiClient.post(`${config.BASE_URL}/gateway/v1/auth/user/password/match`, {
    email,
    password,
  });
  return response.data;
};
