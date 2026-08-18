import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    count: {
        label: "Opportunities",
    }
} satisfies ChartConfig;

export function PipelineChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={4}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}
