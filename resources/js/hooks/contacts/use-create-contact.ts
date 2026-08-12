import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import contactsRoute from '@/routes/contacts';
import { contactKeys } from '@/components/query-keys';
import type { Contact } from '@/types';

type CreateContactData = {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
};

export function useCreateContact() {
    const queryClient = useQueryClient();

    return useMutation<Contact, ApiError, CreateContactData>({
        mutationFn: async (data) => {
            return await api.post(contactsRoute.store().url, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
        },
    });
}
