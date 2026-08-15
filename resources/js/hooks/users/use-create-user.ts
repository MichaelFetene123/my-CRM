import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminUsersRoute from '@/routes/admin/users';
import { userKeys } from '@/components/query-keys';

export type CreateUserData = {
    name: string;
    email: string;
    role_id: string | number;
};

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, CreateUserData>({
        mutationFn: async (data) => {
            return await api.post(adminUsersRoute.store().url, data);
        },
        onSuccess: () => {
            toast.success('User created successfully');
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create user');
        },
    });
}
