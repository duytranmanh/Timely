import { useEffect, useState } from "react"
import ActivityForm from "@/components/ActivityForm"
import ActivityList from "@/components/ActivityList"
import Navbar from "@/components/NavBar"
import type { Activity } from "@/types/Activity"
import ReportPanel from "@/components/ReportPanel"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

function Dashboard() {
  const [date, setDate] = useState<Date>(new Date())
  const [activities, setActivities] = useState<Activity[]>([])

  async function fetchActivityFromDate(date: Date): Promise<Activity[]> {
    // TODO: replace with actual backend call
    await fetch(`TODO: insert URL here ${date.toISOString().split("T")[0]}`, {
      headers: {
        Authorization: "TODO: insert authorized token",
      },
    })
    return [] // TODO: return actual fetched data
  }

  useEffect(() => {
    // TODO: uncomment this line
    // fetchActivityFromDate(date).then(setActivities)
    setActivities([
      {
        id: 1,
        start_time: "08:00",
        end_time: "09:00",
        category: "Exercise",
        mood: "Refreshed",
        energy_level: 7,
      },
      {
        id: 2,
        start_time: "09:30",
        end_time: "11:00",
        category: "Study",
        mood: "Focused",
        energy_level: 6,
      },
      {
        id: 3,
        start_time: "11:15",
        end_time: "12:00",
        category: "Social",
        mood: "Uplifted",
        energy_level: 8,
      },
      {
        id: 4,
        start_time: "13:00",
        end_time: "15:00",
        category: "Work",
        mood: "Drained",
        energy_level: 4,
      },
      {
        id: 5,
        start_time: "16:00",
        end_time: "17:30",
        category: "Reading",
        mood: "Calm",
        energy_level: 6,
      },
    ])
  }, [date])

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="flex gap-6">
          <div className="w-1/2">
            <ActivityForm date={date} setDate={setDate} />
          </div>
          <div className="w-1/2">
            <ActivityList activities={activities} />
          </div>
        </div>

        {/* Divider and Header for Reports */}
        <hr className="my-10 border-gray-300" />
        <h1 className="text-2xl font-semibold mb-6">Reports</h1>

        {/* Report Panels */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <ReportPanel
            cardDescription="Daily Report"
            reportPeriod="1/1/2001"
            title="Report"
            config={chartConfig}
            data={chartData}
          />
          <ReportPanel
            cardDescription="Daily Report"
            reportPeriod="1/1/2001"
            title="Report"
            config={chartConfig}
            data={chartData}
          />
          <ReportPanel
            cardDescription="Daily Report"
            reportPeriod="1/1/2001"
            title="Report"
            config={chartConfig}
            data={chartData}
          />
        </div>
      </div>
    </>
  )

}

export default Dashboard
