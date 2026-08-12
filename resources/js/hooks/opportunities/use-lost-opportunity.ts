import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';

type LostOpportunityData = {
    id: number;
    reason: string;
};

export function useLostOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, LostOpportunityData>({
        mutationFn: async ({ id, reason }) => {
            return await api.post(apiOpportunitiesRoute.lost(id).url, { reason });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
        },
    });
}
