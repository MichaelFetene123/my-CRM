import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiLeadsRoute from '@/routes/apiLeads';
import { leadKeys } from '@/components/query-keys';
import { toast } from 'sonner';

export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: async (id) => {
            await api.delete(apiLeadsRoute.destroy(id).url);
        },
        onSuccess: () => {
            toast.success('Lead deleted successfully');
            queryClient.invalidateQueries({ queryKey: leadKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while deleting the lead');
        },
    });
}
