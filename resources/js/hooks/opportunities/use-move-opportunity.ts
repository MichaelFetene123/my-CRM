import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import opportunitiesRoute from '@/routes/opportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';

type MoveOpportunityData = {
    id: number;
    stage_id: number;
};

export function useMoveOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, MoveOpportunityData>({
        mutationFn: async ({ id, ...data }) => {
            return await api.put(opportunitiesRoute.update(id).url, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
        },
    });
}
