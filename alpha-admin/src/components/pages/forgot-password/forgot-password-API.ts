
import axios from 'axios';
import { config } from '../../../config/config';
import apiClient from '../login/axios-setup';


// 1. Request OTP
export const requestOTP = async (email: string) => {
  try {
    const response = await apiClient.post(`${config.BASE_URL}/gateway/v1/auth/password/otp`, { email });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// 2. Verify OTP
export const verifyOTP = async (email: string, otp: number) => {
  try {
    const response = await apiClient.post(`${config.BASE_URL}/gateway/v1/auth/password/otp/verify`, { email, otp });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// 3. Update Password
export const updatePassword = async (password: string, accessToken: string) => {
    try {
      const response = await apiClient.put(`${config.BASE_URL}/gateway/v1/auth/password`, 
      { password }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
