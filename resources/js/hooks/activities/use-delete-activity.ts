import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiActivitiesRoute from '@/routes/apiActivities';
import {
    activityKeys,
    contactKeys,
    leadKeys,
    opportunityKeys,
} from '@/components/query-keys';
import { toast } from 'sonner';

type DeleteActivityData = {
    id: number;
};

export function useDeleteActivity() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, DeleteActivityData>({
        mutationFn: async ({ id }) => {
            return await api.delete(apiActivitiesRoute.destroy(id).url);
        },
        onSuccess: (_, variables) => {
            toast.success('Activity deleted successfully');
            queryClient.invalidateQueries({ queryKey: activityKeys.all });
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
