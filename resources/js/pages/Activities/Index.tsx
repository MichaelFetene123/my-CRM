import { Head } from '@inertiajs/react';
import { ListSkeleton } from '@/components/skeleton/list-skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import activities from '@/routes/activities';
import { useActivities } from '@/hooks/activities/use-activities';
import { useCompleteActivity } from '@/hooks/activities/use-complete-activity';
import { useDeleteActivity } from '@/hooks/activities/use-delete-activity';
import { Trash2 } from 'lucide-react';
import type { Activity, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Activities', href: activities.index().url },
];

export default function Activities() {
    const { data: activityList, isLoading } = useActivities();
    const { mutate: completeActivity, isPending: isCompleting } = useCompleteActivity();
    const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity();

    function complete(id: number) {
        completeActivity({ id });
    }

    const grouped = activityList
        ? activityList.reduce<Record<string, Activity[]>>((acc, a) => {
              const day = new Date(a.due_at).toLocaleDateString();
              (acc[day] ??= []).push(a);
              return acc;
          }, {})
        : {};

    return (
        <>
            <Head title="Activities" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Activities</h1>
                {isLoading ? (
                    <ListSkeleton />
                ) : (
                    <>
                        {Object.entries(grouped).map(([day, items]) => (
                            <div key={day}>
                                <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                                    {day}
                                </h2>
                                <ul className="space-y-2">
                                    {items.map((activity) => {
                                        const isOverdue =
                                            !activity.completed_at &&
                                            new Date(activity.due_at) <
                                                new Date();
                                        return (
                                            <li
                                                key={activity.id}
                                                className="flex items-center justify-between rounded border p-3"
                                            >
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
                                                    <span className="text-sm">
                                                        {new Date(
                                                            activity.due_at,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                {!activity.completed_at && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isCompleting || isDeleting}
                                                        onClick={() =>
                                                            complete(
                                                                activity.id,
                                                            )
                                                        }
                                                    >
                                                        Complete
                                                    </Button>
                                                )}
                                                {activity.completed_at && (
                                                    <Dialog>
                                                        <DialogTrigger
                                                            render={
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                    disabled={isDeleting}
                                                                />
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogTitle>Delete Activity</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete this activity? This action cannot be undone.
                                                            </DialogDescription>
                                                            <DialogFooter className="gap-2 sm:justify-end">
                                                                <DialogClose
                                                                    render={<Button variant="secondary" />}
                                                                >
                                                                    Cancel
                                                                </DialogClose>
                                                                <DialogClose
                                                                    render={
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => deleteActivity({ id: activity.id })}
                                                                        />
                                                                    }
                                                                >
                                                                    Delete Activity
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                        {(!activityList || activityList.length === 0) && (
                            <p className="text-sm text-muted-foreground italic">
                                No activities scheduled.
                            </p>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

Activities.layout = {
    breadcrumbs,
};
