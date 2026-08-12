import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import activitiesRoute from '@/routes/activities';
import { activityKeys, contactKeys, leadKeys, opportunityKeys } from '@/components/query-keys';
import type { Activity } from '@/types';

type CreateActivityData = {
    entity_type: 'lead' | 'opportunity' | 'contact';
    entity_id: number;
    type: 'call' | 'meeting' | 'task' | 'email';
    due_at: string;
};

export function useCreateActivity() {
    const queryClient = useQueryClient();

    return useMutation<Activity, ApiError, CreateActivityData>({
        mutationFn: async (data) => {
            return await api.post(activitiesRoute.store().url, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: activityKeys.all });
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
    });
}
