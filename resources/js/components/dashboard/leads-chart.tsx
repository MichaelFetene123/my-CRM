import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    count: {
        label: "Leads",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig;

export function LeadsChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} width={80} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
