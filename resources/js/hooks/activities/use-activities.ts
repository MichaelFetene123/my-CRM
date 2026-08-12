import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiActivitiesRoute from '@/routes/apiActivities';
import { activityKeys } from '@/components/query-keys';
import type { Activity } from '@/types';

export function useActivities() {
    return useQuery({
        queryKey: activityKeys.list(),
        queryFn: async (): Promise<Activity[]> => {
            return await api.get(apiActivitiesRoute.index().url);
        },
        staleTime: 0,
    });
}
