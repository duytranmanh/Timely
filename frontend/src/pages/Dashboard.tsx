import { useEffect, useState } from "react"
import ActivityForm from "@/components/ActivityForm"
import ActivityList from "@/components/ActivityList"
import Navbar from "@/components/NavBar"
import type { Activity } from "@/types/Activity"
import type { ChartConfig } from "@/components/ui/chart"
import TimeUsagePanel from "@/components/TimeUsagePanel"
import CategoryTrendPanel from "@/components/CategoryTrendPanel"
import CategorySelectorPanel from "@/components/CategorySelector"

function Dashboard() {
  const [date, setDate] = useState<Date>(new Date())
  const [activities, setActivities] = useState<Activity[]>([])

  // TODO: replace with actual backend call
  function simulateReportFetch(type: string): Promise<{
    data: any[];
    config: ChartConfig;
    period: string;
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


  async function fetchActivityFromDate(date: Date): Promise<Activity[]> {
    // TODO: replace with actual backend call
    await fetch(`insert URL here ${date.toISOString().split("T")[0]}`, {
      headers: {
        Authorization: "insert authorized token",
      },
    })
    return [] // return actual fetched data
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
          <TimeUsagePanel
            title="Time Usage"
            fetchReport={simulateReportFetch}
          />
            <CategoryTrendPanel />
        </div>
      </div>
    </>
  )

}

export default Dashboard
