import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import apiRolesRoute from '@/routes/apiRoles';
import { roleKeys, userKeys } from '@/components/query-keys';

export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, number>({
        mutationFn: async (roleId) => {
            return await api.delete(apiRolesRoute.destroy(roleId).url);
        },
        onSuccess: () => {
            toast.success('Role deleted successfully');
            queryClient.invalidateQueries({ queryKey: roleKeys.list() });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            const errorMessage = error.errors?.role?.[0] || error.message || 'Failed to delete role';
            toast.error(errorMessage);
        },
    });
}
