import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import leadsRoute from '@/routes/leads';
import { leadKeys } from '@/components/query-keys';
import type { Lead } from '@/types';

type DiscardLeadData = {
    id: number;
    reason: string;
};

export function useDiscardLead() {
    const queryClient = useQueryClient();

    return useMutation<Lead, ApiError, DiscardLeadData>({
        mutationFn: async ({ id, ...data }) => {
            return await api.post(leadsRoute.discard(id).url, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
    });
}
