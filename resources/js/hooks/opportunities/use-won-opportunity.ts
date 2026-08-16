import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

type WonOpportunityData = {
    id: number;
};

export function useWonOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, WonOpportunityData>({
        mutationFn: async ({ id }) => {
            return await api.post(apiOpportunitiesRoute.won(id).url);
        },
        onSuccess: (_, variables) => {
            toast.success('Opportunity marked as won');
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(variables.id) });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
