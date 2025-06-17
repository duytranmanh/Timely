"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
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

type ReportPanelProps = {
  title: string;
  fetchReport: (type: string) => Promise<{
    data: Object[];
    config: ChartConfig;
    period: string;
  }>;
};

function TimeUsagePanel({ title, fetchReport }: ReportPanelProps) {
  const [reportType, setReportType] = useState("daily")
  const [data, setData] = useState<Object[]>([])
  const [config, setConfig] = useState<ChartConfig>({})
  const [periodText, setPeriodText] = useState("")

  useEffect(() => {
    fetchReport(reportType).then(res => {
      setData(res.data)
      setConfig(res.config)
      setPeriodText(res.period)
    })
  }, [reportType])

  return (
    <Card className="flex w-full md:w-1/2 lg:w-1/3">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
        <div>
          <CardTitle>{title}</CardTitle>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing time usage for {periodText}
        </div>
      </CardFooter>
    </Card>
  )
}

export default TimeUsagePanel
