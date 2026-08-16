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
            return await api.post(apiActivitiesRoute.store().url, data);
        },
        onSuccess: (_, variables) => {
            toast.success('Activity created');
            queryClient.invalidateQueries({ queryKey: activityKeys.all });
            
            if (variables.entity_type === 'contact') {
                queryClient.invalidateQueries({ queryKey: contactKeys.all });
            } else if (variables.entity_type === 'opportunity') {
                queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            } else if (variables.entity_type === 'lead') {
                queryClient.invalidateQueries({ queryKey: leadKeys.all });
            }
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
