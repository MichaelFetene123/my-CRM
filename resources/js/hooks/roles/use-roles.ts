import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Role } from '@/types';
import adminRolesRoute from '@/routes/admin/roles';
import { roleKeys } from '@/components/query-keys';

export function useRoles(initialData?: Role[], componentName: string = 'admin/roles/index') {
    return useQuery<Role[]>({
        queryKey: roleKeys.list(),
        queryFn: async () => {
            return await api.getInertiaData(
                adminRolesRoute.index().url,
                'roles',
                componentName
            );
        },
        initialData,
        staleTime: 0,
    });
}
