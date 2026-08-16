import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiPipelineStagesRoute from '@/routes/apiPipelineStages';
import { stageKeys, opportunityKeys } from '@/components/query-keys';
import { toast } from 'sonner';

export function useDeleteStage() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: async (id) => {
            return await api.delete(apiPipelineStagesRoute.destroy(id).url);
        },
        onSuccess: () => {
            toast.success('Stage deleted successfully');
            queryClient.invalidateQueries({ queryKey: stageKeys.all });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while deleting stage');
        },
    });
}
