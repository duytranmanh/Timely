import { useEffect, useState } from "react"
import ActivityForm from "@/components/ActivityForm"
import ActivityList from "@/components/ActivityList"
import Navbar from "@/components/NavBar"
import type { Activity } from "@/types/Activity"

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
    fetchActivityFromDate(date).then(setActivities)
  }, [date])

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="flex gap-6">
          <div className="w-1/2">
            <ActivityForm date={date} setDate={setDate} />
          </div>
          <div className="w-1/2">
            <ActivityList activities={activities} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
