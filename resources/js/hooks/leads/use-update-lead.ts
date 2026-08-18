import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys } from '@/components/query-keys';
import type { Lead } from '@/types';
import { toast } from 'sonner';

type UpdateLeadData = {
    id: number;
    name: string;
    email: string;
    source: string;
};

export function useUpdateLead(leadId: number) {
    const queryClient = useQueryClient();

    return useMutation<Lead, ApiError, UpdateLeadData>({
        mutationFn: async (data) => {
            const { id, ...payload } = data;
            return await api.put(apiLeadsRoute.update(id).url, payload);
        },
        onSuccess: (updatedLead) => {
            toast.success('Lead updated successfully');
            return queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while updating the lead');
        },
    });
}
