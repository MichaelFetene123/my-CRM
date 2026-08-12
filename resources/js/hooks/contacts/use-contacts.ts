import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import contactsRoute from '@/routes/contacts';
import { contactKeys } from '@/components/query-keys';
import type { Contact, PaginatedData } from '@/types';

export function useContacts() {
    return useQuery({
        queryKey: contactKeys.list(),
        queryFn: async (): Promise<PaginatedData<Contact>> => {
            return await api.getInertiaData(
                contactsRoute.index().url,
                'contacts',
                'Contacts/Index'
            );
        },
    });
}
