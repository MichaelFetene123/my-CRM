import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityKeys } from '@/components/query-keys';
import { toast } from 'sonner';

interface UncompleteActivityVariables {
    id: number;
}

export function useUncompleteActivity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: UncompleteActivityVariables) => {
            const response = await fetch(`/api/activities/${id}/uncomplete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to uncomplete activity');
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success('Activity marked as uncompleted');
            queryClient.invalidateQueries({
                queryKey: activityKeys.all,
            });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
