import { useEffect, useState } from "react"
import ActivityForm from "@/components/ActivityForm"
import ActivityList from "@/components/ActivityList"
import Navbar from "@/components/NavBar"
import DateSelector from "@/components/DateSelector"
import type { ActivityRead } from "@/types/Activity"
import TimeUsagePanel from "@/components/TimeUsagePanel"
import CategoryTrendPanel from "@/components/CategoryTrendPanel"
import EnergyCircadianPanel from "@/components/EnergyCircadianPanel"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { authFetch } from "@/lib/authFetch"
import type { ComboOption } from "@/components/combobox/BaseComboBox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { DashboardView } from "@/types/DashboardView"

function Dashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [date, setDate] = useState<Date>(new Date())
  const [activities, setActivities] = useState<ActivityRead[]>([])

  // Trigger Refresh for all Reports
  // const [refresh, setRefresh] = useState(0)

  // Set view mode
  const [view, setView] = useState<DashboardView>("insights")

  // Contains categories and moods for drop down
  const [categoryOptions, setCategoryOptions] = useState<ComboOption[]>([])
  const [moodOptions, setMoodOptions] = useState<ComboOption[]>([])

  /**
     * Fetch Category and Mood from Backend, populate list accordingly
     */
  async function fetchCategoryAndMoodOptions() {
    try {
      const [categoryRes, moodRes] = await Promise.all([
        authFetch(`${API_URL}/categories/`),
        authFetch(`${API_URL}/activities/moods/`)
      ])

      // RESPONSE CHECK
      if (categoryRes.ok && moodRes.ok) {
        const categoryData = await categoryRes.json()
        const moodData = await moodRes.json()

        // MAP FETCHED CATEGORIES AND MOOD TO COMBO BOX OPTION FORMAT
        setCategoryOptions(
          categoryData.map((c: any) => ({
            value: c.id.toString(),
            label: c.name
          }))
        )

        setMoodOptions(
          moodData.map((m: any) => ({
            value: m.value,
            label: m.label
          }))
        )

      } else {
        console.warn("Failed to fetch category or mood options")
      }
    } catch (err) {
      console.error("Error fetching options:", err)
    }
  }

  /**
     * Fetch Activities upon page load or when date is change
     * @param date date which data is being fetched
     * @returns 
     */
  async function fetchActivities(date: Date) {
    try {
      // EXTRACT JUST THE DAY FROM DATE
      const isoDate = date.toISOString().split("T")[0]

      // GET TIMEZONE
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

      // SEND REQUEST TO BACKEND
      const res = await authFetch(
        `${API_URL}/activities/?date=${isoDate}&tz=${tz}`
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


  // Refetch everytime date is changed
  useEffect(() => {
    fetchActivities(date)
  }, [date])

  // Fetch all Mood and Categories options
  useEffect(() => {
    fetchCategoryAndMoodOptions()
  }, [])


  // TODO: Reconsider set refresh
  // if set refresh => refetch the whole page, then categories might just get refreshed again?
  /**
   * Whenever activities is changed, trigger a refresh for all reports
   */
  // useEffect(() => {
  //   setRefresh(k => k + 1)
  // }, [activities])



  return (
    <>
      <Navbar setView={setView} />
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

        {/* <div className="flex flex-col md:flex-row gap-6"> */}
        {/* <div className="w-full md:w-1/3">
            <ActivityForm
              date={date}
              activities={activities}
              setActivities={setActivities}
              moodOptions={moodOptions}
              categoryOptions={categoryOptions}
              setCategoryOptions={setCategoryOptions}
            />
          </div> */}
        {/* <div className="w-full">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Logged Activities</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <ActivityForm
                    date={date}
                    activities={activities}
                    setActivities={setActivities}
                    moodOptions={moodOptions}
                    categoryOptions={categoryOptions}
                    setCategoryOptions={setCategoryOptions}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ActivityList
                setActivities={setActivities}
                activities={activities}
              />
            </CardContent>
          </Card>
        </div>
        {/* </div> */}

        {/* REPORTS */}
        {/* <hr className="my-6 border-gray-300" />
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <TimeUsagePanel date={date} refresh={activities.length} />
          <CategoryTrendPanel date={date} categoryOptions={categoryOptions} />
          <EnergyCircadianPanel activities={activities} />
        </div>
      </div> */}
        {view === "insights" && (
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <TimeUsagePanel date={date} refresh={activities.length} />
            <CategoryTrendPanel date={date} categoryOptions={categoryOptions} />
            <EnergyCircadianPanel activities={activities} />
          </div>
        )}

        {view === "activities" && (
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Logged Activities</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Log Activity</DialogTitle>
                  </DialogHeader>
                  <ActivityForm
                    date={date}
                    activities={activities}
                    setActivities={setActivities}
                    moodOptions={moodOptions}
                    categoryOptions={categoryOptions}
                    setCategoryOptions={setCategoryOptions}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ActivityList setActivities={setActivities} activities={activities} />
            </CardContent>
          </Card>
        )}
      </div>

    </>
  )
}

export default Dashboard
