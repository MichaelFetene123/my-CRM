import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys, opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';

type ConvertLeadData = {
    id: number;
    title: string;
};

export function useConvertLead() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, ConvertLeadData>({
        mutationFn: async ({ id, ...data }) => {
            return await api.post(apiLeadsRoute.convert(id).url, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
        },
    });
}
