import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

type MoveOpportunityData = {
    id: number;
    stage_id: number;
};

export function useMoveOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, MoveOpportunityData>({
        mutationFn: async ({ id, ...data }) => {
            return await api.post(apiOpportunitiesRoute.move(id).url, data);
        },
        onSuccess: () => {
            toast.success('Opportunity moved');
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
