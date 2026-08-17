import { useState } from 'react';
import { TimelineItem, mergeTimeline } from './timeline-item';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Note, Activity } from '@/types';

interface TimelineProps {
    notes: Note[];
    activities: Activity[];
}

export function Timeline({ notes, activities }: TimelineProps) {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const merged = mergeTimeline(notes, activities);
    
    if (merged.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                No timeline entries yet.
            </p>
        );
    }

    const totalPages = Math.ceil(merged.length / pageSize);
    const currentEntries = merged.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-4">
            <ul className="space-y-2">
                {currentEntries.map((entry) => (
                    <TimelineItem
                        key={`${entry.kind}-${entry.data.id}`}
                        entry={entry}
                    />
                ))}
            </ul>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-muted-foreground">
                        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, merged.length)} of {merged.length} entries
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
