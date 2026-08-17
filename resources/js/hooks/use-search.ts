import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGlobalSearch = (query: string) => {
    return useQuery({
        queryKey: ['global-search', query],
        queryFn: async () => {
            if (!query) return {};
            const { data } = await axios.get('/api/search', { params: { q: query } });
            return data;
        },
        enabled: query.length > 0,
    });
};
