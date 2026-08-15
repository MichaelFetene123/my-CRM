import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import adminRolesRoute from '@/routes/admin/roles';
import { roleKeys } from '@/components/query-keys';

export function useDeleteRole(roleId: number) {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, void>({
        mutationFn: async () => {
            return await api.delete(adminRolesRoute.destroy(roleId).url);
        },
        onSuccess: () => {
            queryClient.setQueryData(roleKeys.list(), (old: any) => {
                if (!old) return old;
                return old.filter((r: any) => r.id !== roleId);
            });
            toast.success('Role deleted successfully');
            queryClient.invalidateQueries({ queryKey: roleKeys.list() });
        },
        onError: (error) => {
            const errorMessage = error.errors?.role?.[0] || error.message || 'Failed to delete role';
            toast.error(errorMessage);
        },
    });
}
