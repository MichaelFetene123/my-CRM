import { Head, Deferred } from '@inertiajs/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartSkeleton } from '@/components/skeleton/chart-skeleton';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

import { MetricCard } from '@/components/dashboard/metric-card';
import { PipelineChart } from '@/components/dashboard/pipeline-chart';
import { WinRateChart } from '@/components/dashboard/win-rate-chart';
import { LeadsChart } from '@/components/dashboard/leads-chart';
import { ActivityChart } from '@/components/dashboard/activity-chart';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Props {
    openPipeline: { count: number };
    pipelineByStage: { id: number; name: string; count: number }[];
    winRate: { won: number; lost: number; rate: number };
    overdueActivities: number;
    upcomingActivities: number;
    leadsBySource: { source: string; count: number }[];
}

export default function Dashboard(props: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
                <MetricCard title="Open Pipeline">
                    <Deferred
                        data="openPipeline"
                        fallback={<Skeleton className="h-8 w-16" />}
                    >
                        <p className="text-3xl font-semibold">
                            {props.openPipeline?.count}
                        </p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Win Rate">
                    <Deferred
                        data="winRate"
                        fallback={<Skeleton className="h-8 w-16" />}
                    >
                        <p className="text-3xl font-semibold">
                            {props.winRate?.rate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {props.winRate?.won} won / {props.winRate?.lost}{' '}
                            lost
                        </p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Overdue Activities">
                    <Deferred
                        data="overdueActivities"
                        fallback={<Skeleton className="h-8 w-16" />}
                    >
                        <p className="text-3xl font-semibold text-destructive">
                            {props.overdueActivities}
                        </p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Upcoming (7 days)">
                    <Deferred
                        data="upcomingActivities"
                        fallback={<Skeleton className="h-8 w-16" />}
                    >
                        <p className="text-3xl font-semibold">
                            {props.upcomingActivities}
                        </p>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Pipeline by Stage">
                    <Deferred
                        data="pipelineByStage"
                        fallback={<Skeleton className="h-24 w-full" />}
                    >
                        <ul className="space-y-1 text-sm">
                            {props.pipelineByStage?.map((s) => (
                                <li
                                    key={s.id}
                                    className="flex justify-between"
                                >
                                    <span>{s.name}</span>
                                    <span className="font-medium">
                                        {s.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Deferred>
                </MetricCard>

                <MetricCard title="Leads by Source">
                    <Deferred
                        data="leadsBySource"
                        fallback={<Skeleton className="h-24 w-full" />}
                    >
                        <ul className="space-y-1 text-sm">
                            {props.leadsBySource?.map((s) => (
                                <li
                                    key={s.source}
                                    className="flex justify-between"
                                >
                                    <span>{s.source}</span>
                                    <span className="font-medium">
                                        {s.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Deferred>
                </MetricCard>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 pb-6 lg:grid-cols-2">
                <MetricCard title="Pipeline by Stage">
                    <Deferred data="pipelineByStage" fallback={<ChartSkeleton />}>
                        <PipelineChart data={props.pipelineByStage} />
                    </Deferred>
                </MetricCard>

                <MetricCard title="Win Rate">
                    <Deferred data="winRate" fallback={<ChartSkeleton />}>
                        <WinRateChart winRate={props.winRate} />
                    </Deferred>
                </MetricCard>

                <MetricCard title="Leads by Source">
                    <Deferred data="leadsBySource" fallback={<ChartSkeleton />}>
                        <LeadsChart data={props.leadsBySource} />
                    </Deferred>
                </MetricCard>

                <MetricCard title="Activity Overview">
                    <Deferred data="upcomingActivities,overdueActivities" fallback={<ChartSkeleton />}>
                        <ActivityChart upcoming={props.upcomingActivities} overdue={props.overdueActivities} />
                    </Deferred>
                </MetricCard>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
