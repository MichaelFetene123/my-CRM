import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
    import adminRolesRoute from '@/routes/admin/roles';
import { roleKeys } from '@/components/query-keys';

export type AssignPermissionData = {
    permission_id: string;
};

export function useAssignPermission(roleId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, AssignPermissionData>({
        mutationFn: async (data) => {
            return await api.post(adminRolesRoute.assignPermission(roleId).url, data);
        },
        onSuccess: () => {
            toast.success('Permissions updated successfully');
            queryClient.invalidateQueries({ queryKey: roleKeys.list() });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            const errorMessage = error.errors?.permission_id?.[0] || error.message || 'Failed to assign permission';
            toast.error(errorMessage);
        },
    });
}
