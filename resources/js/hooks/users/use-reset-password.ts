import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

import adminApiUsersRoute from '@/routes/adminApiUsers';

export function useResetPassword(userId: number) {
    return useMutation<{ message: string; password: string }, ApiError, void>({
        mutationFn: async () => {
            return await api.post(adminApiUsersRoute.resetPassword(userId).url, {});
        },
        onSuccess: () => {
            toast.success('Password reset successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to reset password');
        },
    });
}
