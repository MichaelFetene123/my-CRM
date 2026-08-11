import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { OpportunityCard } from './opportunity-card';
import type { Opportunity, PipelineStage } from '@/types';

interface Props {
    stage: PipelineStage;
    opportunities: Opportunity[];
}

export function StageColumn({ stage, opportunities }: Props) {
    const { setNodeRef } = useDroppable({ id: stage.id });

    return (
        <div className="flex-1 min-w-65 bg-muted/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">{stage.name}</h3>
                <span className="text-xs text-muted-foreground">{opportunities.length}</span>
            </div>
            <div ref={setNodeRef} className="space-y-2 min-h-25">
                <SortableContext items={opportunities.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                    {opportunities.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}