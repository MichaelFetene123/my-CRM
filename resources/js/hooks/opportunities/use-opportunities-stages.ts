import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import opportunitiesRoute from '@/routes/opportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { PipelineStage, Opportunity } from '@/types';

export function useOpportunitiesStages() {
    return useQuery({
        queryKey: opportunityKeys.stages(),
        queryFn: async (): Promise<(PipelineStage & { opportunities: Opportunity[] })[]> => {
            return await api.getInertiaData(
                opportunitiesRoute.index().url,
                'stages',
                'opportunities'
            );
        },
        staleTime: 0,
    });
}
