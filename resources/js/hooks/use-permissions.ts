import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export function usePermissions() {
    const { auth } = usePage<PageProps>().props;

    const hasPermission = (permission: string) => {
        // Super Admin bypass
        if (auth.user?.roles?.some((r) => r.name === 'Super Admin')) {
            return true;
        }

        // Check against the user's permission array
        return auth.permissions?.includes(permission) ?? false;
    };

    return { hasPermission };
}
