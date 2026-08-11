import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import activities from '@/routes/activities';
import type { Activity, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Activities', href: activities.index().url }];

export default function Activities({ activities: activityList }: { activities: Activity[] }) {
    const { post, processing } = useForm({});

    function complete(id: number) {
        post(activities.complete(id).url, { preserveScroll: true });
    }

    const grouped = activityList.reduce<Record<string, Activity[]>>((acc, a) => {
        const day = new Date(a.due_at).toLocaleDateString();
        (acc[day] ??= []).push(a);
        return acc;
    }, {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activities" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Activities</h1>
                {Object.entries(grouped).map(([day, items]) => (
                    <div key={day}>
                        <h2 className="text-sm font-medium text-muted-foreground mb-2">{day}</h2>
                        <ul className="space-y-2">
                            {items.map((activity) => {
                                const isOverdue = !activity.completed_at && new Date(activity.due_at) < new Date();
                                return (
                                    <li key={activity.id} className="flex items-center justify-between border rounded p-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={activity.completed_at ? 'secondary' : isOverdue ? 'destructive' : 'outline'}>
                                                {activity.type}
                                            </Badge>
                                            <span className="text-sm">
                                                {new Date(activity.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {!activity.completed_at && (
                                            <Button size="sm" variant="outline" disabled={processing} onClick={() => complete(activity.id)}>
                                                Complete
                                            </Button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
                {activityList.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No activities scheduled.</p>
                )}
            </div>
        </AppLayout>
    );
}
