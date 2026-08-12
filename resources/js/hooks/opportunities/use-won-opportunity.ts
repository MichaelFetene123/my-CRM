import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import opportunitiesRoute from '@/routes/opportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';

type WonOpportunityData = {
    id: number;
};

export function useWonOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, WonOpportunityData>({
        mutationFn: async ({ id }) => {
            return await api.post(opportunitiesRoute.won(id).url);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
        },
    });
}
