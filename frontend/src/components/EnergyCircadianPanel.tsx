"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const stubData = [
  { hour: "06:00", energy: 30 },
  { hour: "08:00", energy: 50 },
  { hour: "10:00", energy: 65 },
  { hour: "12:00", energy: 55 },
  { hour: "14:00", energy: 40 },
  { hour: "16:00", energy: 45 },
  { hour: "18:00", energy: 60 },
  { hour: "20:00", energy: 50 },
  { hour: "22:00", energy: 35 },
]

const chartConfig: ChartConfig = {
  energy: {
    label: "Energy Level",
    color: "var(--chart-1)",
  },
}

export default function EnergyCircadianPanel() {
  return (
    <Card className="w-full md:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>Energy Circadian Rhythm</CardTitle>
        <CardDescription>Visualizing average energy across the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={stubData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="energy"
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% today <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing energy pattern across the day
        </div>
      </CardFooter>
    </Card>
  )
}
