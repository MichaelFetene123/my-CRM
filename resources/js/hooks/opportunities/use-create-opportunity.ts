import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import opportunitiesRoute from '@/routes/opportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

type CreateOpportunityData = {
    title: string;
    value: string;
    stage_id: number;
    contact_id?: number;
};

export function useCreateOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, CreateOpportunityData>({
        mutationFn: async (data) => {
            return await api.post(opportunitiesRoute.store().url, data);
        },
        onSuccess: () => {
            toast.success('Opportunity created');
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        }
    });
}
