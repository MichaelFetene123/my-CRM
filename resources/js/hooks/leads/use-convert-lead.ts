import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys, opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

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
        onSuccess: (_, variables) => {
            toast.success('Lead converted to opportunity');
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
