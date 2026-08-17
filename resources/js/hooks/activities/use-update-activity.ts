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

type UpdateActivityData = {
    entity_type: 'lead' | 'opportunity' | 'contact';
    entity_id: number;
    type: 'call' | 'meeting' | 'task' | 'email';
    due_at: string;
};

export function useUpdateActivity() {
    const queryClient = useQueryClient();

    return useMutation<Activity, ApiError, { id: number; data: UpdateActivityData }>({
        mutationFn: async ({ id, data }) => {
            return await api.put(apiActivitiesRoute.update(id).url, data);
        },
        onSuccess: (data) => {
            toast.success('Activity updated');
            queryClient.invalidateQueries({ queryKey: activityKeys.all });
            
            if (data.entity_type === 'contact') {
                queryClient.invalidateQueries({ queryKey: contactKeys.all });
            } else if (data.entity_type === 'opportunity') {
                queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            } else if (data.entity_type === 'lead') {
                queryClient.invalidateQueries({ queryKey: leadKeys.all });
            }
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
