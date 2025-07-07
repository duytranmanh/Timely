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
import type { ActivityRead } from "@/types/Activity"
import { formatTime } from "@/lib/utils"

type EnergyCircadianPanelProps = {
  activities: ActivityRead[]
}

function formatHourOnly(dateStr: string): string {
  const date = new Date(dateStr)
  const hour = date.getHours().toString().padStart(2, "0")
  return `${hour}:00`
}


// Helper: generate full range of hour keys
function generateHourKeys(start = 6, end = 22): string[] {
  const hours: string[] = []
  for (let h = start; h <= end; h++) {
    const hour = h.toString().padStart(2, "0") + ":00"
    hours.push(hour)
  }
  return hours
}

// Chart config
const chartConfig: ChartConfig = {
  energy: {
    label: "Energy Level",
    color: "var(--chart-1)",
  },
}

export default function EnergyCircadianPanel({ activities }: EnergyCircadianPanelProps) {
  // Group energy levels by formatted hour
  const energyByHour = new Map<string, number[]>()

  activities.forEach((a) => {
    const hourKey = formatHourOnly(a.start_time)
    if (!energyByHour.has(hourKey)) {
      energyByHour.set(hourKey, [])
    }
    energyByHour.get(hourKey)!.push(a.energy_level)
  })

  // Generate chart data with all hours from 06:00 to 22:00
  const allHours = generateHourKeys(0, 23)

  const chartData = allHours.map((hour) => {
    const energies = energyByHour.get(hour)
    return {
      hour,
      energy: energies
        ? Math.round((energies.reduce((sum, e) => sum + e, 0) / energies.length) * 10) / 10
        : null,
    }
  })

  return (
    <Card className="w-full md:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>Energy Circadian Rhythm</CardTitle>
        <CardDescription>Visualizing energy level throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
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
              connectNulls={true} // Show gaps where data is missing
              isAnimationActive={false}
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
