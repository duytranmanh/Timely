"use client"

import { TrendingUp } from "lucide-react"
import { Bar, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
} from "@/components/ui/chart"
import type { ActivityRead } from "@/types/Activity"

type EnergyCircadianPanelProps = {
  activities: ActivityRead[]
}

/**
 * Extract hour from a given date string
 * @param dateStr date string (ISO formatted)
 * @returns HH:00
 */
function formatHourOnly(dateStr: string): string {
  const date = new Date(dateStr)
  const hour = date.getHours().toString().padStart(2, "0")
  return `${hour}:00`
}


/**
 * Helper function, generating time mark formatted as HH:00 from start to end
 * @param start start time (inclusive)
 * @param end end time (inclusive)
 * @returns List of strings
 */
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
    label: "",
    color: "var(--chart-1)",
  },
}

export default function EnergyCircadianPanel({ activities }: EnergyCircadianPanelProps) {
  // GROUP ENERGY LEVEL BY HOUR
  const energyByHour = new Map<string, number[]>()

  // GROUP ENERGY LEVEL BY HOUR
  activities.forEach((a) => {
    const hourKey = formatHourOnly(a.start_time)
    if (!energyByHour.has(hourKey)) {
      energyByHour.set(hourKey, [])
    }
    energyByHour.get(hourKey)!.push(a.energy_level)
  })

  // GENERATE X-AXIS LABEL FROM 00:00 TO 23:00
  const allHours = generateHourKeys(0, 23)

  // FOR EACH HOUR, TAKE THE AVERAGE ENERGY OF ALL ACTIVITIES WITHIN THAT HOUR MARK
  const chartData = allHours.map((hour) => {
    const matched = activities.filter(
      (a) => formatHourOnly(a.start_time) === hour
    )

    const energies = matched.map((a) => a.energy_level)
    const activityNames = matched.map((a) => a.category.name)

    return {
      hour,
      energy: energies.length
        ? Math.round((energies.reduce((sum, e) => sum + e, 0) / energies.length) * 10) / 10
        : null,
      activityNames,
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
            <YAxis
              domain={[0, 11]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide={true}
            />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            />
            {/* TOOLTIP DISPLAY ALL ACTIVITIES NAME WITHIN GIVEN HOUR MARK */}
            <ChartTooltip
              cursor={{ stroke: "#ccc", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const { energy, activityNames } = payload[0].payload

                return (
                  <div className="rounded-md border bg-white px-3 py-2 text-xs shadow">
                    <div className="font-medium">Energy: {energy}</div>
                    {activityNames?.length > 0 && (
                      <div className="mt-1 text-muted-foreground">
                        {activityNames.join(", ")}
                      </div>
                    )}
                  </div>
                )
              }}
              isAnimationActive={false}
            />

            <Bar dataKey="energy" fill="transparent" />
            <Line
              dataKey="energy"
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
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
