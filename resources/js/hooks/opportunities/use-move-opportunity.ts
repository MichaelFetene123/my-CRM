import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiOpportunitiesRoute from '@/routes/apiOpportunities';
import { opportunityKeys } from '@/components/query-keys';
import type { Opportunity, PipelineStage } from '@/types';
import { toast } from 'sonner';

type MoveOpportunityData = {
    id: number;
    stage_id: number;
};

type StagesData = (PipelineStage & { opportunities: Opportunity[] })[];

export function useMoveOpportunity() {
    const queryClient = useQueryClient();

    return useMutation<Opportunity, ApiError, MoveOpportunityData, { previousStages?: StagesData }>({
        mutationFn: async ({ id, ...data }) => {
            return await api.post(apiOpportunitiesRoute.move(id).url, data);
        },
        onMutate: async ({ id, stage_id }) => {
            await queryClient.cancelQueries({ queryKey: opportunityKeys.stages() });

            const previousStages = queryClient.getQueryData<StagesData>(opportunityKeys.stages());

            if (previousStages) {
                queryClient.setQueryData<StagesData>(opportunityKeys.stages(), (old) => {
                    if (!old) return old;
                    
                    const next = old.map((stage) => ({
                        ...stage,
                        opportunities: [...stage.opportunities],
                    }));
                    
                    let foundOpp: Opportunity | null = null;
                    
                    for (let i = 0; i < next.length; i++) {
                        const idx = next[i].opportunities.findIndex(o => o.id === id);
                        if (idx !== -1) {
                            foundOpp = next[i].opportunities[idx];
                            next[i].opportunities.splice(idx, 1);
                            break;
                        }
                    }
                    
                    if (foundOpp) {
                        const targetStageIndex = next.findIndex(s => s.id === stage_id);
                        if (targetStageIndex !== -1) {
                            next[targetStageIndex].opportunities.push({
                                ...foundOpp,
                                stage_id: stage_id,
                            });
                        }
                    }
                    
                    return next;
                });
            }

            return { previousStages };
        },
        onSuccess: () => {
            toast.success('Opportunity moved');
        },
        onError: (error, _, context) => {
            toast.error(error.message || 'An error occurred');
            if (context?.previousStages) {
                queryClient.setQueryData(opportunityKeys.stages(), context.previousStages);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: opportunityKeys.stages() });
        },
    });
}
