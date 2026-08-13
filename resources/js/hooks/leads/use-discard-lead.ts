import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys } from '@/components/query-keys';
import type { Lead } from '@/types';
import { toast } from 'sonner';

type DiscardLeadData = {
    id: number;
    reason: string;
};

export function useDiscardLead() {
    const queryClient = useQueryClient();

    return useMutation<Lead, ApiError, DiscardLeadData>({
        mutationFn: async ({ id, ...data }) => {
            return await api.post(apiLeadsRoute.discard(id).url, data);
        },
        onSuccess: () => {
            toast.success('Lead discarded');
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
