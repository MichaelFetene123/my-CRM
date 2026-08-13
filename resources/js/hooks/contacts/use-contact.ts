import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiContactsRoute from '@/routes/apiContacts';
import { contactKeys } from '@/components/query-keys';
import type { Contact, Lead, Opportunity, Note, Activity } from '@/types';

type ContactWithRelations = Contact & {
    leads: Lead[];
    opportunities: Opportunity[];
    notes: Note[];
    activities: Activity[];
};

export function useContact(id: number, initialData?: ContactWithRelations) {
    return useQuery({
        queryKey: contactKeys.detail(id),
        queryFn: async (): Promise<ContactWithRelations> => {
            return await api.get(apiContactsRoute.show(id).url);
        },
        initialData,
        staleTime: 0,
    });
}
