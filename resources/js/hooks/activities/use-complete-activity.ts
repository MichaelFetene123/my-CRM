import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import activitiesRoute from '@/routes/activities';
import { activityKeys, contactKeys, leadKeys, opportunityKeys } from '@/components/query-keys';
import type { Activity } from '@/types';

type CompleteActivityData = {
    id: number;
};

export function useCompleteActivity() {
    const queryClient = useQueryClient();

    return useMutation<Activity, ApiError, CompleteActivityData>({
        mutationFn: async ({ id }) => {
            return await api.post(activitiesRoute.complete(id).url);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: activityKeys.all });
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
    });
}
