
// ************************************* API SETUP *************************************
import axios from 'axios';

import { useDispatch } from 'react-redux';
// import { refreshToken } from './loginAPI';

// Create an axios instance
const apiClient = axios.create({
    baseURL: 'http://34.49.176.205', // Your API base URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to include access token in requests
apiClient.interceptors.request.use((config) => {

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor to handle 401 errors (token expiration)
apiClient.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const originalRequest = error.config;
        // const dispatch = useDispatch<AppDispatch>();
        console.log("401 error", error.response.status)
        // Check for 401 (Unauthorized) and retry the request after refreshing the token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // Prevent infinite retry loop

            try {
            //     console.log('401 error intercepted, attempting token refresh...');

                // const { accessToken } = await refreshToken();

                // Update the Authorization header with the new access token
                // originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                window.location.reload();
                // Retry the original request with the new access token
                return apiClient(originalRequest);
            } catch (refreshError: any) {
                console.error('401 Failed to refresh token, logging out:', refreshError);
                // Dispatch the logout action if refresh fails
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error); // Return other errors as usual
    }
);

export default apiClient;







