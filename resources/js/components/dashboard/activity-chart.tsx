import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    upcoming: {
        label: "Upcoming",
        color: "hsl(var(--chart-4))",
    },
    overdue: {
        label: "Overdue",
        color: "hsl(var(--destructive))",
    },
    count: {
        label: "Activities",
    }
} satisfies ChartConfig;

export function ActivityChart({ upcoming, overdue }: { upcoming: number; overdue: number }) {
    const data = [
        { name: 'Upcoming', count: upcoming || 0, fill: "var(--color-upcoming)" },
        { name: 'Overdue', count: overdue || 0, fill: "var(--color-overdue)" },
    ];
    return (
        <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} tickMargin={10} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
