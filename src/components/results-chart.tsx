"use client"

import type { ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChartHorizontal } from "lucide-react"

interface ResultsChartProps {
  chartData: any[]
  chartConfig: ChartConfig
  unit: string
  pipeLength: number
}

export function ResultsChart({ chartData, chartConfig, unit, pipeLength }: ResultsChartProps) {
  const totalRods = Object.keys(chartConfig).length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BarChartHorizontal className="h-6 w-6 text-primary" />
            Graphical Plan
        </CardTitle>
        <CardDescription>
          Visual representation of the {totalRods} rods covering the {pipeLength} {unit} pipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="pipeLength" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => `${value} ${unit} coverage`}
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`var(--color-${key})`}
                radius={0}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
