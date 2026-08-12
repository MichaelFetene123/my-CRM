import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys } from '@/components/query-keys';
import type { Lead, PaginatedData } from '@/types';

export function useLeads() {
    return useQuery({
        queryKey: leadKeys.list(),
        queryFn: async (): Promise<PaginatedData<Lead>> => {
            return await api.get(apiLeadsRoute.index().url);
        },
        staleTime: 0,
    });
}
