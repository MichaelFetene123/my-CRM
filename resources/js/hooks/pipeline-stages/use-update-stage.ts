import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiPipelineStagesRoute from '@/routes/apiPipelineStages';
import { stageKeys, opportunityKeys } from '@/components/query-keys';
import type { PipelineStage } from '@/types';
import { toast } from 'sonner';

type UpdateStageData = {
    name: string;
    order: number;
    is_won: boolean;
    is_lost: boolean;
};

export function useUpdateStage(stageId: number) {
    const queryClient = useQueryClient();

    return useMutation<PipelineStage, ApiError, UpdateStageData>({
        mutationFn: async (data) => {
            return await api.put(apiPipelineStagesRoute.update(stageId).url, data);
        },
        onSuccess: () => {
            toast.success('Stage updated successfully');
            queryClient.invalidateQueries({ queryKey: stageKeys.all });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
