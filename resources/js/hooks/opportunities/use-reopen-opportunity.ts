import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

type ReopenOpportunityData = {
    id: number;
};

export function useReopenOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, ReopenOpportunityData>({
        mutationFn: async ({ id }) => {
            return await api.post(apiOpportunitiesRoute.reopen(id).url);
        },
        onSuccess: (_, variables) => {
            toast.success('Opportunity reopened');
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
