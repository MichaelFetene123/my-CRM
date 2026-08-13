import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import opportunities from '@/routes/opportunities';
import type { Opportunity } from '@/types';

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: opportunity.id,
        disabled: opportunity.status !== 'open',
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="cursor-grab active:cursor-grabbing">
                <CardContent className="space-y-1 p-3">
                    <Link
                        href={opportunities.show(opportunity.id).url}
                        className="text-sm font-medium hover:underline"
                        onClick={(e) => isDragging && e.preventDefault()}
                    >
                        {opportunity.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {opportunity.contact?.name}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
