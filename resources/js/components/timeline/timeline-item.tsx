import { Badge } from '@/components/ui/badge';
import type { Note, Activity } from '@/types';
import { CheckCircle2 } from 'lucide-react';

type TimelineEntry =
    { kind: 'note'; data: Note } | { kind: 'activity'; data: Activity };

export function mergeTimeline(
    notes: Note[],
    activities: Activity[],
): TimelineEntry[] {
    const noteEntries: TimelineEntry[] = notes.map((n) => ({
        kind: 'note',
        data: n,
    }));
    const activityEntries: TimelineEntry[] = activities.map((a) => ({
        kind: 'activity',
        data: a,
    }));
    return [...noteEntries, ...activityEntries].sort(
        (a, b) =>
            new Date(b.data.created_at).getTime() -
            new Date(a.data.created_at).getTime(),
    );
}

export function TimelineItem({ entry }: { entry: TimelineEntry }) {
    const date = new Date(entry.data.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    if (entry.kind === 'note') {
        const note = entry.data;
        return (
            <li className="space-y-1 border-l-2 py-1 pl-3 text-sm">
                <div className="flex items-center gap-2">

                    <span className="text-xs text-muted-foreground">
                        {date}
                    </span>
                </div>
                <p>{note.body}</p>
            </li>
        );
    }

    const activity = entry.data;
    const isOverdue =
        !activity.completed_at && new Date(activity.due_at) < new Date();

    return (
        <li className="space-y-1 border-l-2 py-1 pl-3 text-sm">
            <div className="flex items-center gap-2">
                <Badge
                    variant={
                        activity.completed_at
                            ? 'secondary'
                            : isOverdue
                              ? 'destructive'
                              : 'outline'
                    }
                >
                    {activity.type}
                </Badge>
                {activity.completed_at && (
                    <Badge variant="outline" className="gap-1 border-green-600 text-green-600 pl-1.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                    </Badge>
                )}
                <span className="text-xs text-muted-foreground">{date}</span>
            </div>
            <p>
                {activity.completed_at
                    ? `Due ${new Date(activity.due_at).toLocaleDateString()}`
                    : isOverdue
                      ? `Overdue — was due ${new Date(activity.due_at).toLocaleDateString()}`
                      : `Due ${new Date(activity.due_at).toLocaleDateString()}`}
            </p>
        </li>
    );
}
