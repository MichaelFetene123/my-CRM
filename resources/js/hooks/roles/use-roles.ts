import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Role } from '@/types';
import adminRolesRoute from '@/routes/admin/roles';
import { roleKeys } from '@/components/query-keys';
import { usePage } from '@inertiajs/react';

export function useRoles(initialData?: Role[]) {
    const { version } = usePage();
    return useQuery<Role[]>({
        queryKey: roleKeys.list(),
        queryFn: async () => {
            return await api.getInertiaData(
                adminRolesRoute.index().url,
                'roles',
                'admin/roles/index',
                version
            );
        },
        initialData,
        staleTime: 0,
    });
}
