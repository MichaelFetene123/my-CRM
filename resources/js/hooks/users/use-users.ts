import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';
import adminUsersRoute from '@/routes/admin/users';
import { userKeys } from '@/components/query-keys';

export function useUsers(initialData?: User[]) {
    return useQuery<User[]>({
        queryKey: userKeys.list(),
        queryFn: async () => {
            return await api.getInertiaData(
                adminUsersRoute.index().url,
                'users',
                'admin/users/index'
            );
        },
        initialData,
    });
}
