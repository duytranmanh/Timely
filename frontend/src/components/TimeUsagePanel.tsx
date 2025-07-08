"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select"
import { authFetch } from "@/lib/authFetch"
import { getColorForCategory } from "@/lib/utils"

type ReportPanelProps = {
  date: Date,
  refresh: number
};

function TimeUsagePanel({ date, refresh }: ReportPanelProps) {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [reportType, setReportType] = useState("daily")
  const [data, setData] = useState<Object[]>([])
  const [config, setConfig] = useState<ChartConfig>({})
  const [periodText, setPeriodText] = useState("")

  async function fetchTimeUsage(date: Date, reportType: string) {
    try {
      // PROCESS DATE
      const dateIso = date.toISOString().split("T")[0]

      // FETCH REPORT
      const res = await authFetch(
        `${API_URL}/reports/${reportType}/?date=${dateIso}`
      )

      // RESPONSE STATUS CHECK
      if (!res.ok) {
        const error = await res.json()
        console.warn("Error fetching activities:", error.detail || JSON.stringify(error))
        return
      }

      // SET DATA
      const data = await res.json()
      setData(
        data.activities.map((a: any) => ({
          activity: a.name,
          "time spent": a.hours,
          fill: getColorForCategory(a.name)
        }))
      )

      setPeriodText(data.period)

      const chartConfig: ChartConfig = {
        "time spent": { label: "Hour(s)" },
      }

      data.activities.forEach((a: any) => {
        chartConfig[a.name] = {
          label: a.name,
          color: getColorForCategory(a.name),
        }
      })

      setConfig(chartConfig)

    }
    catch (err) {
      console.warn(`Error fetching ${reportType} report`, err)
    }
  }

  /**
   * Everytime report type changes or refresh is trigger, refetch timeusage report
   */
  useEffect(() => {
    fetchTimeUsage(date, reportType)
  }, [reportType, refresh])

  return (
    <Card className="flex w-full md:w-1/2 lg:w-1/3">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
        <div>
          <CardTitle>Time Usage</CardTitle>
          <CardDescription>{periodText}</CardDescription>
        </div>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltipContent
              indicator="line"
              formatter={(value, name) => [`${value} hour${value !== 1 ? "s" : ""}`, name]}
            />
            <Pie data={data} dataKey="time spent" nameKey="activity" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground leading-none">
          Showing time usage for {periodText}
        </div>
      </CardFooter>
    </Card>
  )
}

export default TimeUsagePanel
