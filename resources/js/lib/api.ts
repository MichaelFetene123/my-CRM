import axios from './axios';

export type ApiError = Error & {
    status?: number;
    errors?: Record<string, string[]>;
};

export const api = {
    get: async <T = any>(
        url: string,
        headers?: Record<string, string>,
    ): Promise<T> => {
        const finalUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
        const res = await axios.get<T>(finalUrl, { headers });
        return res.data;
    },
    post: async <T = any>(
        url: string,
        data?: any,
        headers?: Record<string, string>,
    ): Promise<T> => {
        const res = await axios.post<T>(url, data, { headers });
        return res.data;
    },
    put: async <T = any>(
        url: string,
        data?: any,
        headers?: Record<string, string>,
    ): Promise<T> => {
        const res = await axios.put<T>(url, data, { headers });
        return res.data;
    },
    delete: async <T = any>(
        url: string,
        headers?: Record<string, string>,
    ): Promise<T> => {
        const res = await axios.delete<T>(url, { headers });
        return res.data;
    },

    /**
     * Specialized fetch for extracting deferred props from Inertia backend
     */
    getInertiaData: async (
        url: string,
        propName: string,
        componentName: string,
        version?: string | null,
    ) => {
        // Prevent aggressive browser disk-caching on XHR GET requests
        const finalUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;

        const headers: Record<string, string> = {
            'X-Inertia': 'true',
            'X-Inertia-Partial-Data': propName,
            'X-Inertia-Partial-Component': componentName,
        };

        if (version) {
            headers['X-Inertia-Version'] = version;
        }

        const res = await axios.get(finalUrl, { headers });
        return res.data.props?.[propName];
    },
};
