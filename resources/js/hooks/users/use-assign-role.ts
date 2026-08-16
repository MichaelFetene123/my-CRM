import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminApiUsersRoute from '@/routes/adminApiUsers';
import { userKeys, roleKeys } from '@/components/query-keys';

export type AssignRoleData = {
    role_id: string;
};

export function useAssignRole(userId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, AssignRoleData>({
        mutationFn: async (data) => {
            return await api.post(adminApiUsersRoute.assignRole(userId).url, data);
        },
        onSuccess: () => {
            toast.success('Role assigned successfully');
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            const errorMessage = error.errors?.role_id?.[0] || error.message || 'Failed to assign role';
            toast.error(errorMessage);
        },
    });
}
