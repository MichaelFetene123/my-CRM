import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import adminRolesRoute from '@/routes/admin/roles';
import { roleKeys } from '@/components/query-keys';

export type CreateRoleData = {
    name: string;
    description: string;
};

export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation<any, ApiError, CreateRoleData>({
        mutationFn: async (data) => {
            return await api.post(adminRolesRoute.store().url, data);
        },
        onSuccess: () => {
            toast.success('Role created successfully');
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error) => {
            const errorMessage = error.errors?.name?.[0] || error.message || 'Failed to create role';
            toast.error(errorMessage);
        },
    });
}
