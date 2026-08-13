import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity, Contact, Lead, Activity, Note } from '@/types';

type OpportunityWithRelations = Opportunity & {
    contact?: Contact;
    lead?: Lead;
    activities: Activity[];
    notes: Note[];
};

export function useOpportunity(
    id: number,
    initialData?: OpportunityWithRelations,
) {
    return useQuery({
        queryKey: opportunityKeys.detail(id),
        queryFn: async (): Promise<OpportunityWithRelations> => {
            return await api.get(apiOpportunitiesRoute.show(id).url);
        },
        initialData,
        staleTime: 0,
    });
}
