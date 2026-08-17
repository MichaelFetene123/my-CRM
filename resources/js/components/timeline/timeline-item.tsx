import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Note, Activity } from '@/types';
import { CheckCircle2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateActivity } from '@/hooks/activities/use-update-activity';
import { useUpdateNote } from '@/hooks/notes/use-update-note';
import { usePermissions } from '@/hooks/use-permissions';

type TimelineEntry =
    | { kind: 'note'; data: Note }
    | { kind: 'activity'; data: Activity };

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

function NoteItem({ note, date }: { note: Note; date: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(note.body);
    const { mutate: updateNote, isPending } = useUpdateNote();
    const { hasPermission } = usePermissions();

    const handleSave = () => {
        updateNote(
            { id: note.id, body, entity_type: note.entity_type as 'lead' | 'opportunity' | 'contact' },
            {
                onSuccess: () => setIsEditing(false),
            }
        );
    };

    return (
        <li className="space-y-1 border-l-2 py-1 pl-3 text-sm group">
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{date}</span>
                </div>
                {!isEditing && hasPermission('notes.update') && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="h-3 w-3" />
                    </Button>
                )}
            </div>
            {isEditing ? (
                <div className="space-y-2 mt-2 bg-muted/30 p-2 rounded-md border border-border/50">
                    <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="text-sm min-h-20"
                    />
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsEditing(false);
                                setBody(note.body); // reset
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="whitespace-pre-wrap">{note.body}</p>
            )}
        </li>
    );
}

const toDateTimeLocal = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function ActivityItem({ activity, date }: { activity: Activity; date: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [type, setType] = useState<Activity['type']>(activity.type);
    
    const formattedDueAt = activity.due_at ? toDateTimeLocal(activity.due_at) : '';
    const [dueAt, setDueAt] = useState(formattedDueAt);
    
    const { mutate: updateActivity, isPending } = useUpdateActivity();
    const { hasPermission } = usePermissions();

    const handleSave = () => {
        // Only sending updated fields
        updateActivity(
            { id: activity.id, data: { type, due_at: dueAt, entity_type: activity.entity_type, entity_id: activity.entity_id } },
            {
                onSuccess: () => setIsEditing(false),
            }
        );
    };

    const isOverdue =
        !activity.completed_at && new Date(activity.due_at) < new Date();

    return (
        <li className="space-y-1 border-l-2 py-1 pl-3 text-sm group">
            <div className="flex items-center gap-2 justify-between">
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
                        <Badge
                            variant="outline"
                            className="gap-1 border-green-600 text-green-600 pl-1.5"
                        >
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                        </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{date}</span>
                </div>
                {!isEditing && hasPermission('activities.update') && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="h-3 w-3" />
                    </Button>
                )}
            </div>
            {isEditing ? (
                <div className="space-y-2 mt-2 bg-muted/30 p-2 rounded-md border border-border/50">
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={type} onValueChange={(v) => {
                            if (v) setType(v as Activity['type']);
                        }}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="call">Call</SelectItem>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="task">Task</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="datetime-local"
                            className="h-8 text-xs"
                            value={dueAt}
                            onChange={(e) => setDueAt(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsEditing(false);
                                setType(activity.type);
                                setDueAt(formattedDueAt);
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <p>
                    {activity.completed_at
                        ? `Due ${new Date(activity.due_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                        : isOverdue
                          ? `Overdue — was due ${new Date(activity.due_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                          : `Due ${new Date(activity.due_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                </p>
            )}
        </li>
    );
}

export function TimelineItem({ entry }: { entry: TimelineEntry }) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const createdDateStr = formatDate(entry.data.created_at);
    let dateDisplay = createdDateStr;

    if (entry.data.updated_at) {
        const createdTime = new Date(entry.data.created_at).getTime();
        const updatedTime = new Date(entry.data.updated_at).getTime();
        if (updatedTime - createdTime > 1000) {
            dateDisplay = `Created ${createdDateStr} · Updated ${formatDate(entry.data.updated_at)}`;
        }
    }

    if (entry.kind === 'note') {
        return <NoteItem note={entry.data} date={dateDisplay} />;
    }

    return <ActivityItem activity={entry.data} date={dateDisplay} />;
}
