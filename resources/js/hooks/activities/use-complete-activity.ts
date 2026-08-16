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
            queryClient.invalidateQueries({ queryKey: activityKeys.list() });
            queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: contactKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
