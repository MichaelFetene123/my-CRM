import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys } from '@/components/query-keys';
import type { Lead } from '@/types';

type LeadWithRelations = Lead & {
    contact?: any;
    owner?: any;
};

export function useLead(id: number, initialData?: LeadWithRelations) {
    return useQuery({
        queryKey: leadKeys.detail(id),
        queryFn: async (): Promise<LeadWithRelations> => {
            return await api.get(apiLeadsRoute.show(id).url);
        },
        initialData,
        staleTime: 0,
    });
}
