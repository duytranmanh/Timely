"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import CategorySelectorButton from "./CategorySelector"

const stubChartData = [
  { month: "January", Study: 40, Work: 30 },
  { month: "February", Study: 50, Work: 25 },
  { month: "March", Study: 45, Work: 35 },
  { month: "April", Study: 55, Work: 28 },
  { month: "May", Study: 60, Work: 32 },
  { month: "June", Study: 52, Work: 30 },
]

const stubChartConfig: ChartConfig = {
  Study: {
    label: "Study",
    color: "var(--chart-1)",
  },
  Work: {
    label: "Work",
    color: "var(--chart-2)",
  },
}

function CategoryTrendPanel() {
  return (
    <Card className="flex w-full md:w-1/2 lg:w-1/3">
       <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
        <CardTitle>Category Trend</CardTitle>
        <CardDescription>Tracked activity changes over time</CardDescription>
        <CategorySelectorButton/>
      </CardHeader>
      <CardContent>
        <ChartContainer config={stubChartConfig}>
          <LineChart
            data={stubChartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="Study"
              type="natural"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
            <Line
              dataKey="Work"
              type="natural"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-2)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up overall <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Category breakdown from January to June
        </div>
      </CardFooter>
    </Card>
  )
}

export default CategoryTrendPanel
