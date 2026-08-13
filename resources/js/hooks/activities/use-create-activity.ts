import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import activitiesRoute from '@/routes/activities';
import { activityKeys, contactKeys, leadKeys, opportunityKeys } from '@/components/query-keys';
import type { Activity } from '@/types';
import { toast } from 'sonner';

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
            toast.success('Activity created');
            queryClient.invalidateQueries({ queryKey: activityKeys.list() });
            queryClient.invalidateQueries({ queryKey: contactKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        }
    });
}
