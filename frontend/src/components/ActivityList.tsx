import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Trash } from "lucide-react"
import type { ActivityRead } from "../types/Activity"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/utils"
import { authFetch } from "@/lib/authFetch"
import { useState, type Dispatch, type SetStateAction } from "react"
import { PopupAlert } from "./PopupAlert"

type ActivityListProps = {
  activities: ActivityRead[],
  setActivities: Dispatch<SetStateAction<ActivityRead[]>>
}

function ActivityList({ setActivities, activities }: ActivityListProps) {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  // Error Pop-Up
  const [errorAlert, setErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Success Alert
  const [successAlert, setSuccessAlert] = useState(false)

  const handleDelete = async (id: number) => {
    // VALIDATION
    if (!id) {
      console.warn("Activity id not valid for deletion")
    }

    // HANDLE DELETION
    try {
      // SEND DELETE REQUEST
      const res = await authFetch(
        `${API_URL}/activities/${id}/`,
        {
          method: "DELETE"
        }
      )

      // RESPONSE STATUS CHECK
      if (!res.ok) {
        try {
          const errorData = await res.json()
          setErrorMessage(errorData?.detail || "Something went wrong.")
        } catch (err) {
          setErrorMessage("An unknown error occurred.")
        }
        setErrorAlert(true)
        return
      }

      // REMOVE ACTIVITY FROM ACTIVITY LIST IMMEDIATELY
      setActivities((prev) => prev.filter((activity) => activity.id !== id))

      // POPUP ALERT
      setSuccessAlert(true)
    }
    catch (err) {
      console.log("Error deleting Activity", err)
    }
  }

  return (
    <div className="max-h-[400px] overflow-y-auto rounded-md [&_table]:border-0 [&_th]:border-0 [&_td]:border-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Mood</TableHead>
            <TableHead>Energy</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities && activities.length > 0 ? (
            activities.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{formatTime(a.start_time)} – {formatTime(a.end_time)}</TableCell>
                <TableCell>{a.category.name}</TableCell>
                <TableCell>{a.mood.label}</TableCell>
                <TableCell>{a.energy_level}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(a.id!)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No activities recorded.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* SUCCESS POP-UP ALERT */}
      <PopupAlert
        open={successAlert}
        onOpenChange={setSuccessAlert}
        title="Activity Deleted"
        description="The activity has been successfully removed."
      />

      {/* ERROR POP-UP ALERT */}
      <PopupAlert
        open={errorAlert}
        onOpenChange={setErrorAlert}
        title="Delete Failed"
        description={errorMessage}
      />
    </div>
  )
}

export default ActivityList
