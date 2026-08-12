import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import leadsRoute from '@/routes/leads';
import { leadKeys } from '@/components/query-keys';
import type { Lead, PaginatedData } from '@/types';

export function useLeads() {
    return useQuery({
        queryKey: leadKeys.list(),
        queryFn: async (): Promise<PaginatedData<Lead>> => {
            return await api.getInertiaData(
                leadsRoute.index().url,
                'leads',
                'Leads/Index'
            );
        },
    });
}
