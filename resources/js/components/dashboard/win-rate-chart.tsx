import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    won: {
        label: "Won",
        color: "hsl(var(--chart-2))",
    },
    lost: {
        label: "Lost",
        color: "hsl(var(--destructive))",
    }
} satisfies ChartConfig;

export function WinRateChart({ winRate }: { winRate: any }) {
    if (!winRate) return null;
    const data = [
        { name: 'won', value: winRate.won || 0, fill: "var(--chart-1)" },
        { name: 'lost', value: winRate.lost || 0, fill: "var(--chart-5)" },
    ];
    return (
        <div className="relative flex h-72 w-full items-center justify-center">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" nameKey="name" stroke="none" />
                </PieChart>
            </ChartContainer>
            <div className="absolute text-center pointer-events-none">
                <p className="text-3xl font-bold">{winRate.rate || 0}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
            </div>
        </div>
    );
}
