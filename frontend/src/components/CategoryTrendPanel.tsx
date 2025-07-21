"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CartesianGrid, Line, LineChart, XAxis, YAxis,
} from "recharts"

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, type ChartConfig,
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
  date: Date
}

function CategoryTrendPanel({ date, categoryOptions }: CategoryTrendPanelProps) {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [trendData, setTrendData] = useState<BackendCategoryTrend[]>([])
  const [trendStart, setTrendStart] = useState("")
  const [trendEnd, setTrendEnd] = useState("")

  // Memoize selected label strings (names) from selected category IDs.
  // Avoids re-calculating every render unless selected categories or options change.
  const selectedLabels = useMemo(() => {
    return categoryOptions
      .filter((opt) => selectedCategories.includes(opt.value))
      .map((opt) => opt.label)
  }, [selectedCategories, categoryOptions])

  // Transform backend trend data into chart-compatible format.
  // This computation is heavy, memoize to avoid recomputing unless dependencies change.
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

  // Calculate the maximum Y-axis value based on the chart data.
  // Recharts re-renders more smoothly when the Y-axis doesn't fluctuate unnecessarily.
  const maxHours = useMemo(() => {
    let max = 0
    chartData.forEach((d) => {
      selectedLabels.forEach((label) => {
        if (typeof d[label] === "number") {
          max = Math.max(max, d[label])
        }
      })
    })
    return Math.max(12, Math.ceil(max + 1)) // top out at 12
  }, [chartData, selectedLabels])

  // Configure chart line styles (colors, labels) for each selected category.
  // This object is passed into a memoized chart container, so it should be stable unless inputs change.
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {}
    selectedLabels.forEach((label) => {
      config[label] = {
        label,
        color: getColorForCategory(label),
      }
      config[label].label = `${label} (hrs)`
    })
    return config
  }, [selectedLabels])

  async function fetchTrendReport() {
    try {
      // FORMAT DATE TO YYYY-MM-DD FOR BACKEND QUERY
      const dateIso = date.toISOString().split("T")[0]

      // SEND REQUEST TO BACKEND
      const res = await authFetch(`${API_URL}/reports/trends/category/?date=${dateIso}`)

      // HANDLE ERROR RESPONSE AND LOG WARNING
      if (!res.ok) {
        const error = await res.json()
        console.warn("Error fetching trends:", error.detail || JSON.stringify(error))
        return
      }

       // PARSE SUCCESSFUL RESPONSE AND UPDATE STATE
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
  }, [date])

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
              <YAxis hide domain={[0, maxHours]} />
              <ChartTooltip
                cursor={{ stroke: "#ccc", strokeWidth: 1 }}
                isAnimationActive={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null

                  return (
                    <div className="rounded-md border bg-white px-3 py-2 text-xs shadow min-w-[8rem] grid gap-1.5">
                      {payload.map((item, index) => {
                        const color = item.color || "#000"
                        const name = item.name || item.dataKey
                        const value =
                          typeof item.value === "number"
                            ? item.value.toFixed(1)
                            : item.value

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-1.5 min-w-[6rem]">
                              <div
                                className="h-2 w-2 rounded-sm"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-muted-foreground">{name}</span>
                            </div>
                            <span className="font-mono tabular-nums text-foreground">
                              {value} Hour(s)
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                }}
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
