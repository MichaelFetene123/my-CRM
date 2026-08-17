import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminApiUsersRoute from '@/routes/adminApiUsers';
import { userKeys, roleKeys } from '@/components/query-keys';

export function useDeleteAllUsers() {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, void>({
        mutationFn: async () => {
            return await api.delete(adminApiUsersRoute.destroyAll().url);
        },
        onSuccess: () => {
            toast.success('All non-Super Admin users deleted successfully');
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete users');
        },
    });
}
