import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import opportunitiesRoute from '@/routes/opportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity, Contact, Lead, Activity, Note } from '@/types';

type OpportunityWithRelations = Opportunity & {
    contact?: Contact;
    lead?: Lead;
    activities: Activity[];
    notes: Note[];
};

export function useOpportunity(id: number, initialData?: OpportunityWithRelations) {
    return useQuery({
        queryKey: opportunityKeys.detail(id),
        queryFn: async (): Promise<OpportunityWithRelations> => {
            return await api.getInertiaData(
                opportunitiesRoute.show(id).url,
                'opportunity',
                'opportunities-show'
            );
        },
        initialData,
        staleTime: 0,
    });
}
