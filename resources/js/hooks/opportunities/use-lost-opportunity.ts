import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

type LostOpportunityData = {
    id: number;
    reason: string;
};

export function useLostOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, LostOpportunityData>({
        mutationFn: async ({ id, reason }) => {
            return await api.post(apiOpportunitiesRoute.lost(id).url, {
                reason,
            });
        },
        onSuccess: (_, variables) => {
            toast.success('Opportunity marked as lost');
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(variables.id) });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
