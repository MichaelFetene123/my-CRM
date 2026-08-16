import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiContactsRoute from '@/routes/apiContacts';
import { contactKeys } from '@/components/query-keys';
import type { Contact } from '@/types';
import { toast } from 'sonner';

type UpdateContactData = {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
};

export function useUpdateContact(id: number) {
    const queryClient = useQueryClient();

    return useMutation<Contact, ApiError, UpdateContactData>({
        mutationFn: async (data) => {
            return await api.put(apiContactsRoute.update(id).url, data);
        },
        onSuccess: () => {
            toast.success('Contact updated');
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
            queryClient.invalidateQueries({
                queryKey: contactKeys.detail(id),
            });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
