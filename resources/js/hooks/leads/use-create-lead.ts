import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys } from '@/components/query-keys';
import type { Lead } from '@/types';
import { toast } from 'sonner';

type CreateLeadData = {
    title: string;
    company: string;
    value: number;
    contact_id: number;
};

export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation<Lead, ApiError, CreateLeadData>({
        mutationFn: async (data) => {
            return await api.post(apiLeadsRoute.store().url, data);
        },
        onSuccess: () => {
            toast.success('Lead created');
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
