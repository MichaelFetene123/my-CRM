import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';
import adminUsersRoute from '@/routes/admin/users';
import { userKeys } from '@/components/query-keys';
import { usePage } from '@inertiajs/react';

export function useUsers(initialData?: User[]) {
    const { version } = usePage();
    const key = userKeys.list();
    console.log('[DEBUG] useUsers mounting/rendering. queryKey:', JSON.stringify(key));
    
    return useQuery<User[]>({
        queryKey: key,
        queryFn: async () => {
            console.log('[DEBUG] useUsers queryFn executing... fetching fresh data');
            return await api.getInertiaData(
                adminUsersRoute.index().url,
                'users',
                'admin/users/index',
                version
            );
        },
        initialData,
    });
}
