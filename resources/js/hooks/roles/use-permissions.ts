import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Permission } from '@/types';
import adminRolesRoute from '@/routes/admin/roles';
import { permissionKeys } from '@/components/query-keys';

export function usePermissions(initialData?: Permission[], componentName: string = 'admin/roles/index') {
    return useQuery<Permission[]>({
        queryKey: permissionKeys.list(),
        queryFn: async () => {
            return await api.getInertiaData(
                adminRolesRoute.index().url,
                'permissions',
                componentName
            );
        },
        initialData,
    });
}
