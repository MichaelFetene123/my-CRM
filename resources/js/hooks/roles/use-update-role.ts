import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import apiRolesRoute from '@/routes/apiRoles';
import { roleKeys } from '@/components/query-keys';

export type UpdateRoleData = {
    name: string;
    description?: string;
    permissions?: number[];
};

export function useUpdateRole(roleId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, UpdateRoleData>({
        mutationFn: async (data) => {
            return await api.put(apiRolesRoute.update(roleId).url, data);
        },
        onSuccess: () => {
            toast.success('Role updated successfully');
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            const errorMessage = error.errors?.name?.[0] || error.errors?.role?.[0] || error.message || 'Failed to update role';
            toast.error(errorMessage);
        },
    });
}
