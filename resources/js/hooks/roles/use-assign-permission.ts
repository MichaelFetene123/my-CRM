import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import apiRolesRoute from '@/routes/apiRoles';
import { roleKeys } from '@/components/query-keys';

export type AssignPermissionData = {
    permission_id: number;
};

export function useAssignPermission(roleId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, AssignPermissionData>({
        mutationFn: async (data) => {
            return await api.post(apiRolesRoute.assignPermission(roleId).url, data);
        },
        onSuccess: () => {
            toast.success('Permissions updated successfully');
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            const errorMessage = error.errors?.permission_id?.[0] || error.message || 'Failed to assign permission';
            toast.error(errorMessage);
        },
    });
}
