import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminApiUsersRoute from '@/routes/adminApiUsers';
import { userKeys, roleKeys } from '@/components/query-keys';

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, number>({
        mutationFn: async (userId) => {
            return await api.delete(adminApiUsersRoute.destroy(userId).url);
        },
        onSuccess: (_, userId) => {
            toast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete user');
        },
    });
}
