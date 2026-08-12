import axios from 'axios';

function getCsrfToken() {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
        return decodeURIComponent(match[2]);
    }
    return '';
}

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

axiosInstance.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase();
    if (method && method !== 'GET' && method !== 'HEAD') {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-XSRF-TOKEN'] = token;
        }
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Normalize the error to match what the hooks currently expect (ApiError structure)
        const customError = new Error(error.response?.data?.message || error.message);
        (customError as any).status = error.response?.status;
        (customError as any).errors = error.response?.data?.errors;
        return Promise.reject(customError);
    }
);

export default axiosInstance;
