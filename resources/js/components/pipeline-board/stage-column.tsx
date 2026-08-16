import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { OpportunityCard } from './opportunity-card';
import type { Opportunity, PipelineStage } from '@/types';

interface Props {
    stage: PipelineStage;
    opportunities: Opportunity[];
}

export function StageColumn({ stage, opportunities }: Props) {
    const { setNodeRef } = useDroppable({
        id: `stage-${stage.id}`,
        disabled: stage.is_won || stage.is_lost,
    });

    return (
        <div className="flex min-w-65 flex-1 flex-col rounded-lg bg-muted/40 p-3">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium">
                    {stage.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                        {opportunities.length}
                    </span>
                </h3>
                {(stage.is_won || stage.is_lost) && (
                    <span className="text-xs text-muted-foreground">
                        (via action only)
                    </span>
                )}
            </div>
            <div ref={setNodeRef} className="min-h-25 flex-1 space-y-2">
                <SortableContext
                    items={opportunities.map((o) => `opp-${o.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {opportunities.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
