import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiActivitiesRoute from '@/routes/apiActivities';
import {
    activityKeys,
    contactKeys,
    leadKeys,
    opportunityKeys,
} from '@/components/query-keys';
import type { Activity } from '@/types';
import { toast } from 'sonner';

type CompleteActivityData = {
    id: number;
};

export function useCompleteActivity() {
    const queryClient = useQueryClient();

    return useMutation<Activity, ApiError, CompleteActivityData>({
        mutationFn: async ({ id }) => {
            return await api.post(apiActivitiesRoute.complete(id).url);
        },
        onSuccess: (_, variables) => {
            toast.success('Activity marked as complete');
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
