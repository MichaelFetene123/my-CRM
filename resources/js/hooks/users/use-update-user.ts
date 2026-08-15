import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminUsersRoute from '@/routes/admin/users';
import { userKeys } from '@/components/query-keys';

export type UpdateUserData = {
    name: string;
    email: string;
    role_id: string | number;
};

export function useUpdateUser(userId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, UpdateUserData>({
        mutationFn: async (data) => {
            return await api.put(adminUsersRoute.update(userId).url, data);
        },
        onSuccess: () => {
            toast.success('User updated successfully');
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update user');
        },
    });
}
