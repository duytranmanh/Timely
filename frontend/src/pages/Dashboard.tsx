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

  // Trigger Refresh for all Reports
  const [refresh, setRefresh] = useState(0)

  /**
   * Whenever activities is changed, trigger a refresh for all reports
   */
  useEffect(() => {
    setRefresh(k => k + 1)
  }, [activities])


  /**
     * Fetch Activities upon page load or when date is change
     * @param date date which data is being fetched
     * @returns 
     */
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

  useEffect(() => {
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
            <ActivityForm
              date={date}
              activities={activities}
              setActivities={setActivities}
            />
          </div>
          <div className="w-full md:w-2/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Logged Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityList
                  setActivities={setActivities}
                  activities={activities}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* REPORTS */}
        <hr className="my-6 border-gray-300" />
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* TODO: all of these panels depends on activities, if activities changes, they all refresh */}
          <TimeUsagePanel date={date} refresh={refresh} />
          <CategoryTrendPanel />
          <EnergyCircadianPanel />
        </div>
      </div>
    </>
  )
}

export default Dashboard
