import axios from './axios';

export type ApiError = Error & { status?: number; errors?: Record<string, string[]> };

export const api = {
    get: async (url: string, headers?: Record<string, string>) => {
        const res = await axios.get(url, { headers });
        return res.data;
    },
    post: async (url: string, data?: any, headers?: Record<string, string>) => {
        const res = await axios.post(url, data, { headers });
        return res.data;
    },
    put: async (url: string, data?: any, headers?: Record<string, string>) => {
        const res = await axios.put(url, data, { headers });
        return res.data;
    },
    delete: async (url: string, headers?: Record<string, string>) => {
        const res = await axios.delete(url, { headers });
        return res.data;
    },
    
    /**
     * Specialized fetch for extracting deferred props from Inertia backend
     */
    getInertiaData: async (url: string, propName: string, componentName: string) => {
        const res = await axios.get(url, {
            headers: {
                'X-Inertia': 'true',
                'X-Inertia-Partial-Data': propName,
                'X-Inertia-Partial-Component': componentName
            }
        });
        return res.data.props?.[propName];
    }
};
