import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminApiUsersRoute from '@/routes/adminApiUsers';
import { userKeys, roleKeys } from '@/components/query-keys';

export type UpdateUserData = {
    name: string;
    email: string;
    role_id: string | number;
};

export function useUpdateUser(userId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, UpdateUserData>({
        mutationFn: async (data) => {
            return await api.put(adminApiUsersRoute.update(userId).url, data);
        },
        onSuccess: () => {
            const key = userKeys.list();
            console.log('[DEBUG] useUpdateUser onSuccess REACHED!');
            console.log('[DEBUG] useUpdateUser invalidating queryKey:', JSON.stringify(key));
            
            toast.success('User updated successfully');
            queryClient.invalidateQueries({ queryKey: key });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update user');
        },
    });
}
