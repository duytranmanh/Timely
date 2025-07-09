"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CartesianGrid, LabelList, Line, LineChart, XAxis,
} from "recharts"

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"
import CategorySelectorButton from "./CategorySelector"
import type { ComboOption } from "./combobox/BaseComboBox"
import { authFetch } from "@/lib/authFetch"
import { getColorForCategory } from "@/lib/utils"

type BackendTrendPoint = {
  label: string
  hours: number
}

type BackendCategoryTrend = {
  category_id: number
  category_name: string
  trend: BackendTrendPoint[]
}

type BackendTrendResponse = {
  type: string
  start: string
  end: string
  data: BackendCategoryTrend[]
}

type CategoryTrendPanelProps = {
  categoryOptions: ComboOption[]
}

function CategoryTrendPanel({ categoryOptions }: CategoryTrendPanelProps) {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [trendData, setTrendData] = useState<BackendCategoryTrend[]>([])
  const [trendStart, setTrendStart] = useState("")
  const [trendEnd, setTrendEnd] = useState("")

  const selectedLabels = useMemo(() => {
    return categoryOptions
      .filter((opt) => selectedCategories.includes(opt.value))
      .map((opt) => opt.label)
  }, [selectedCategories, categoryOptions])

  const chartData = useMemo(() => {
    if (trendData.length === 0 || selectedLabels.length === 0) return []

    const allLabels = trendData[0].trend.map((t) => t.label)

    return allLabels.map((label) => {
      const entry: any = { label }
      for (const category of trendData) {
        if (selectedLabels.includes(category.category_name)) {
          const point = category.trend.find((t) => t.label === label)
          entry[category.category_name] = point?.hours ?? 0
        }
      }
      return entry
    })
  }, [trendData, selectedLabels])

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {}
    selectedLabels.forEach((label) => {
      config[label] = {
        label,
        color: getColorForCategory(label),
      }
    })
    return config
  }, [selectedLabels])

  async function fetchTrendReport() {
    try {
      const res = await authFetch(`${API_URL}/reports/trends/category/`)
      if (!res.ok) {
        const error = await res.json()
        console.warn("Error fetching trends:", error.detail || JSON.stringify(error))
        return
      }

      const result: BackendTrendResponse = await res.json()
      setTrendData(result.data)
      setTrendStart(result.start)
      setTrendEnd(result.end)
    } catch (err) {
      console.warn("Error fetching category trend", err)
    }
  }

  useEffect(() => {
    fetchTrendReport()
  }, [])

  const hasData = chartData.length > 0 && selectedLabels.length > 0

  return (
    <Card className="flex w-full md:w-1/2 lg:w-1/3">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
        <div>
          <CardTitle>Category Trend</CardTitle>
          <CardDescription>Tracked activity changes over time</CardDescription>
        </div>

        <CategorySelectorButton
          categoryOptions={categoryOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          maxSelected={3}
        />
      </CardHeader>

      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData} margin={{ top: 20, left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5)} // trim YYYY- for day display
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {selectedLabels.map((label) => (
                <Line
                  key={label}
                  dataKey={label}
                  type="natural"
                  stroke={getColorForCategory(label)}
                  strokeWidth={2}
                  dot={{ fill: getColorForCategory(label) }}
                  activeDot={{ r: 6 }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              ))}
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="text-sm text-muted-foreground px-4 py-8 text-center">
            No data available for selected categories.
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          {trendStart && trendEnd && `Trends from ${trendStart} to ${trendEnd}`}
        </div>
      </CardFooter>
    </Card>
  )
}

export default CategoryTrendPanel
