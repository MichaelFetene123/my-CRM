import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Role } from '@/types';
import apiRolesRoute from '@/routes/apiRoles';
import { roleKeys } from '@/components/query-keys';

export function useRolesApi() {
    return useQuery<Role[]>({
        queryKey: roleKeys.api(),
        queryFn: async () => {
            return await api.get(apiRolesRoute.index().url);
        },
    });
}
