import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';

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
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
        },
    });
}
