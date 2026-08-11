import { Head, Deferred } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Props {
    openPipeline: { count: number };
    pipelineByStage: { name: string; count: number }[];
    winRate: { won: number; lost: number; rate: number };
    overdueActivities: number;
    upcomingActivities: number;
    leadsBySource: { source: string; count: number }[];
}

function MetricCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default function Dashboard(props: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Open Pipeline">
                    <Deferred data="openPipeline" fallback={<Skeleton className="h-8 w-16" />}>
                        <p className="text-3xl font-semibold">{props.openPipeline?.count}</p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Win Rate">
                    <Deferred data="winRate" fallback={<Skeleton className="h-8 w-16" />}>
                        <p className="text-3xl font-semibold">{props.winRate?.rate}%</p>
                        <p className="text-xs text-muted-foreground">{props.winRate?.won} won / {props.winRate?.lost} lost</p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Overdue Activities">
                    <Deferred data="overdueActivities" fallback={<Skeleton className="h-8 w-16" />}>
                        <p className="text-3xl font-semibold text-destructive">{props.overdueActivities}</p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Upcoming (7 days)">
                    <Deferred data="upcomingActivities" fallback={<Skeleton className="h-8 w-16" />}>
                        <p className="text-3xl font-semibold">{props.upcomingActivities}</p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Pipeline by Stage">
                    <Deferred data="pipelineByStage" fallback={<Skeleton className="h-24 w-full" />}>
                        <ul className="space-y-1 text-sm">
                            {props.pipelineByStage?.map((s) => (
                                <li key={s.name} className="flex justify-between">
                                    <span>{s.name}</span><span className="font-medium">{s.count}</span>
                                </li>
                            ))}
                        </ul>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Leads by Source">
                    <Deferred data="leadsBySource" fallback={<Skeleton className="h-24 w-full" />}>
                        <ul className="space-y-1 text-sm">
                            {props.leadsBySource?.map((s) => (
                                <li key={s.source} className="flex justify-between">
                                    <span>{s.source}</span><span className="font-medium">{s.count}</span>
                                </li>
                            ))}
                        </ul>
                    </Deferred>
                </MetricCard>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
