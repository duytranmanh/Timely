import { useEffect, useState } from "react"
import ActivityForm from "@/components/ActivityForm"
import ActivityList from "@/components/ActivityList"
import Navbar from "@/components/NavBar"
import DateSelector from "@/components/DateSelector"
import type { ActivityRead } from "@/types/Activity"
import type { ChartConfig } from "@/components/ui/chart"
import TimeUsagePanel from "@/components/TimeUsagePanel"
import CategoryTrendPanel from "@/components/CategoryTrendPanel"
import EnergyCircadianPanel from "@/components/EnergyCircadianPanel"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { authFetch } from "@/lib/authFetch"

function Dashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [date, setDate] = useState<Date>(new Date())
  const [activities, setActivities] = useState<ActivityRead[]>([])

  // Simulate report fetching
  function simulateReportFetch(type: string): Promise<{
    data: any[]
    config: ChartConfig
    period: string
  }> {
    const now = new Date()
    let period = now.toLocaleDateString()

    if (type === "weekly") {
      const start = new Date(now)
      start.setDate(now.getDate() - 6)
      period = `${start.toLocaleDateString()} – ${now.toLocaleDateString()}`
    }

    if (type === "monthly") {
      const start = new Date(now)
      start.setDate(now.getDate() - 31)
      period = `${start.toLocaleDateString()} – ${now.toLocaleDateString()}`
    }

    const demoData = [
      { browser: "Study", visitors: 275, fill: "var(--chart-1)" },
      { browser: "Work", visitors: 200, fill: "var(--chart-2)" },
      { browser: "Leisure", visitors: 150, fill: "var(--chart-3)" },
    ]

    const config = {
      visitors: { label: "Time (%)" },
      Study: { label: "Study", color: "var(--chart-1)" },
      Work: { label: "Work", color: "var(--chart-2)" },
      Leisure: { label: "Leisure", color: "var(--chart-3)" },
    }

    return Promise.resolve({
      data: demoData,
      config,
      period,
    })
  }

  useEffect(() => {
    async function fetchActivities(date: Date) {
      try {
        // EXTRACT JUST THE DAY FROM DATE
        const isoDate = date.toISOString().split("T")[0]
        // SEND REQUEST TO BACKEND
        const res = await authFetch(
          `${API_URL}/activities/?date=${isoDate}`
        )

        // RESPONSE STATUS CHECK
        if (!res.ok) {
          console.warn("Error fetching activities")
          return
        }

        // SET DATA
        const activitiesData = await res.json()
        setActivities(activitiesData)
      }
      catch (err) {
        console.error("Error fetching activities:", err)
      }
    }

    fetchActivities(date)
  }, [date])

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-20 space-y-10">
        {/* DATE SELECTOR HEADER */}
        <section className="space-y-3">
          <h1 className="text-2xl font-bold">Select a Date</h1>
          <p className="text-muted-foreground text-sm">
            All activities and reports below are for the selected day.
          </p>
          <DateSelector date={date} onChange={setDate} />
        </section>

        {/* FORM + LIST */}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <ActivityForm date={date} activities={activities} setActivities={setActivities} />
          </div>
          <div className="w-full md:w-2/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Logged Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityList activities={activities} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* REPORTS */}
        <hr className="my-6 border-gray-300" />
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* TODO: all of these panels depends on activities, if activities changes, they all refresh */}
          <TimeUsagePanel title="Time Usage" fetchReport={simulateReportFetch} />
          <CategoryTrendPanel />
          <EnergyCircadianPanel />
        </div>
      </div>
    </>
  )
}

export default Dashboard
