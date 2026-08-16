import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

type DeleteOpportunityData = {
    id: number;
};

export function useDeleteOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, DeleteOpportunityData>({
        mutationFn: async ({ id }) => {
            return await api.delete(apiOpportunitiesRoute.destroy(id).url);
        },
        onSuccess: () => {
            toast.success('Opportunity deleted successfully');
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            
            // Redirect to opportunities list
            router.visit('/opportunities');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while deleting the opportunity');
        },
    });
}
