import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { PipelineStage, Opportunity, Contact } from '@/types';

export function useOpportunitiesStages() {
    return useQuery({
        queryKey: opportunityKeys.stages(),
        queryFn: async (): Promise<(PipelineStage & { opportunities: Opportunity[] })[]> => {
            const data = await api.get<{ stages: (PipelineStage & { opportunities: Opportunity[] })[], contacts: Contact[] }>(
                apiOpportunitiesRoute.index().url
            );
            return data.stages;
        },
        staleTime: 0,
    });
}
