import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import activitiesRoute from '@/routes/activities';
import { activityKeys } from '@/components/query-keys';
import type { Activity } from '@/types';

export function useActivities() {
    return useQuery({
        queryKey: activityKeys.list(),
        queryFn: async (): Promise<Activity[]> => {
            return await api.getInertiaData(
                activitiesRoute.index().url,
                'activities',
                'Activities/Index'
            );
        },
    });
}
