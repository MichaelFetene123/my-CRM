import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminUsersRoute from '@/routes/admin/users';

export function useResetPassword(userId: number) {
    return useMutation<any, ApiError, void>({
        mutationFn: async () => {
            return await api.post(adminUsersRoute.resetPassword(userId).url, {});
        },
        onSuccess: () => {
            toast.success('Password reset successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to reset password');
        },
    });
}
