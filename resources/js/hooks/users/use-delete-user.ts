import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminUsersRoute from '@/routes/admin/users';
import { userKeys } from '@/components/query-keys';

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, number>({
        mutationFn: async (userId) => {
            return await api.delete(adminUsersRoute.destroy(userId).url);
        },
        onSuccess: () => {
            toast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete user');
        },
    });
}
