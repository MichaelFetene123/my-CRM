import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiContactsRoute from '@/routes/apiContacts';
import { contactKeys } from '@/components/query-keys';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

type DeleteContactData = {
    id: number;
};

export function useDeleteContact() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, DeleteContactData>({
        mutationFn: async ({ id }) => {
            return await api.delete(apiContactsRoute.destroy(id).url);
        },
        onSuccess: () => {
            toast.success('Contact deleted successfully');
            queryClient.invalidateQueries({ queryKey: contactKeys.all });
            
            // Redirect to contacts list
            router.visit('/contacts');
        },
        onError: (error) => {
            if (error.errors && error.errors.contact) {
                toast.error(error.errors.contact[0]);
            } else {
                toast.error(error.message || 'An error occurred while deleting the contact');
            }
        },
    });
}
