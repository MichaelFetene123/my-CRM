import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiContactsRoute from '@/routes/apiContacts';
import { contactKeys } from '@/components/query-keys';
import type { Contact, PaginatedData } from '@/types';

export function useContacts() {
    return useQuery({
        queryKey: contactKeys.list(),
        queryFn: async (): Promise<PaginatedData<Contact>> => {
            return await api.get(apiContactsRoute.index().url);
        },
        staleTime: 0,
    });
}
