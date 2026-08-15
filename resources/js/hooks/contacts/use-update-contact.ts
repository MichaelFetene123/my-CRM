import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import contactsRoute from '@/routes/contacts';
import { contactKeys } from '@/components/query-keys';
import type { Contact } from '@/types';
import { toast } from 'sonner';

type UpdateContactData = {
    id: number;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
};

export function useUpdateContact() {
    const queryClient = useQueryClient();

    return useMutation<Contact, ApiError, UpdateContactData>({
        mutationFn: async ({ id, ...data }) => {
            return await api.put(contactsRoute.update(id).url, data);
        },
        onSuccess: (_, variables) => {
            toast.success('Contact updated');
            queryClient.invalidateQueries({ queryKey: contactKeys.list() });
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
            queryClient.invalidateQueries({
                queryKey: contactKeys.detail(variables.id),
            });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
