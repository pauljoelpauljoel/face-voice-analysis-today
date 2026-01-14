"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"

import { type PerformanceMetric } from "@/app/actions"

const chartConfig = {
  value: {
    label: "Score (%)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface PerformanceDashboardProps {
  metrics: PerformanceMetric[];
}

export function PerformanceDashboard({ metrics }: PerformanceDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
        <CardDescription>Live metrics of the prediction model.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={metrics} layout="vertical" margin={{ left: 10 }}>
            <YAxis
              dataKey="metric"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={80}

            />
            <XAxis type="number" dataKey="value" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" formatter={(value) => `${value}%`} />}
            />
            <Bar dataKey="value" layout="vertical" fill="var(--color-value)" radius={5}>
                <LabelList
                    dataKey="value"
                    position="insideRight"
                    offset={8}
                    className="fill-primary-foreground"
                    fontSize={12}
                    formatter={(value: number) => `${value}%`}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
