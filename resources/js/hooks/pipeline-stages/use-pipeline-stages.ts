import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import apiPipelineStagesRoute from '@/routes/apiPipelineStages';
import { stageKeys } from '@/components/query-keys';
import type { PipelineStage } from '@/types';

export function usePipelineStages() {
    return useQuery<PipelineStage[]>({
        queryKey: stageKeys.list(),
        queryFn: async () => {
            return await api.get(apiPipelineStagesRoute.index().url);
        },
    });
}
