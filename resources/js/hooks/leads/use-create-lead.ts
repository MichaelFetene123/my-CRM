import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import leadsRoute from '@/routes/leads';
import { leadKeys } from '@/components/query-keys';
import type { Lead } from '@/types';
import { toast } from 'sonner';

type CreateLeadData = {
    name: string;
    email?: string;
    source?: string;
};

export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation<Lead, ApiError, CreateLeadData>({
        mutationFn: async (data) => {
            return await api.post(leadsRoute.store().url, data);
        },
        onSuccess: () => {
            toast.success('Lead created');
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
