import { useEffect, useState, type SetStateAction, type Dispatch } from "react"
import { Slider } from "./ui/slider"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import TimeInput from "./TimeInput"
import { CategoryComboBox } from "./combobox/CategoryComboBox"
import { MoodComboBox } from "./combobox/MoodComboBox"
import type { ActivityRead, ActivityCreate } from "@/types/Activity"
import type { ComboOption } from "./combobox/BaseComboBox"
import { authFetch } from "@/lib/authFetch"
import { PopupAlert } from "./PopupAlert"
import { hasOverlap, isTimeRangeValid } from "@/lib/validation"

type ActivityFormProps = {
  date: Date,
  activities: ActivityRead[],
  setActivities: Dispatch<SetStateAction<ActivityRead[]>>
}

/**
 * Form for activity logging
 * @param date Activity date
 * @param activities List of logged activities date from that day
 * @param setActivities Set state for activities
 * @returns 
 */
function ActivityForm({ date, activities, setActivities }: ActivityFormProps) {

  // Api url is saved as a environment variable
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const [category, setCategory] = useState<ComboOption | null>(null)
  const [mood, setMood] = useState("")
  const [energy, setEnergy] = useState(5)
  const [startTime, setStartTime] = useState("10:30")
  const [endTime, setEndTime] = useState("12:30")
  const [notes, setNotes] = useState("")

  // Contains categories and moods for drop down
  const [categoryOptions, setCategoryOptions] = useState<ComboOption[]>([])
  const [moodOptions, setMoodOptions] = useState<ComboOption[]>([])

  // Log successful alert
  const [successAlert, setSuccessAlert] = useState(false)

  // Error alert
  const [errorAlert, setErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Get duration of the current activity about to be submitted
  const getDuration = () => {
    if (!startTime || !endTime) return ""

    // Assuming that it is the same date for easy calculation
    const start = new Date(`1970-01-01T${startTime}`)
    const end = new Date(`1970-01-01T${endTime}`)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60)
    const hrs = Math.floor(diff / 60)
    const mins = diff % 60
    return `${hrs}h ${mins}m`
  }

  /**
   * handle submission for Activity Form
   * @param e 
   * @returns 
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // FIELDS VALIDATION
    if (!category) {
      setErrorMessage("Please select a category.")
      setErrorAlert(true)
      return
    }

    if (!mood) {
      setErrorMessage("Please select a mood.")
      setErrorAlert(true)
      return
    }

    // CHECK IF TIME RANGE IS VALID
    if (!isTimeRangeValid(startTime, endTime)) {
      setErrorMessage("Starting time is later than ending time.")
      setErrorAlert(true)
      return
    }

    const isoDate = date.toISOString().split("T")[0]
    const startIso = new Date(`${isoDate}T${startTime}`).toISOString()
    const endIso = new Date(`${isoDate}T${endTime}`).toISOString()

    // CHECK IF NEW ACTIVITY OVERLAP WITH CURRENT ACTIVITIES? 
    if (hasOverlap(startIso, endIso, activities)) {
      setErrorMessage("New activity conflict with an existing activity.")
      setErrorAlert(true)
      return
    }

    // POPULATE ACTIVITY OBJECT TO SEND TO BACKEND
    const content: ActivityCreate = {
      category_id: parseInt(category.value),
      mood: mood,
      energy_level: energy,
      start_time: startIso,   // make sure this is ISO format
      end_time: endIso,
      notes: notes
    }

    // SEND REQUEST TO BACKEND
    const response = await authFetch(`${API_URL}/activities/`, {
      method: "POST",
      body: JSON.stringify(content),
    })

    // RESPONSE CHECK
    if (!response.ok) {
      try {
        const errorData = await response.json()
        setErrorMessage(errorData?.detail || "Something went wrong.")
      } catch (err) {
        setErrorMessage("An unknown error occurred.")
      }
      setErrorAlert(true)
      return
    }

    const created = await response.json()

    // UPDATE ACTIVITIES LIST AND SORT IMMEDIATELY
    setActivities(prev =>
      [...prev, created].sort((a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )
    )

    console.log("Activity created:", created)

    // SUCCESS ALERT
    setSuccessAlert(true)
  }

  useEffect(() => {
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

    fetchCategoryAndMoodOptions()
  }, [])


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white w-full h-full">
        <h2 className="text-xl font-semibold">Log Activity</h2>

        {/* CATEGORY SELECTION */}
        <CategoryComboBox
          options={categoryOptions}
          setOptions={setCategoryOptions}
          value={category}
          onChange={setCategory}
          className="w-full"
        />

        {/* MOOD SELECTION */}
        <MoodComboBox
          options={moodOptions}
          value={mood}
          onChange={setMood}
          className="w-full"
        />

        {/* ENERGY LEVEL SLIDER */}
        <div>
          <label className="block mb-1">Energy Level: {energy}/10</label>
          <Slider
            defaultValue={[7]}
            max={10}
            name="Energy Level"
            value={[energy]}
            onValueChange={(val) => setEnergy(val[0])}
          />
        </div>

        {/* TIME INPUTS */}
        <div className="flex gap-4">
          <TimeInput label="From" value={startTime} onChange={setStartTime} id="start-time" />
          <TimeInput label="To" value={endTime} onChange={setEndTime} id="end-time" />
        </div>

        {startTime && endTime && (
          <p className="text-sm text-gray-600">Duration: {getDuration()}</p>
        )}

        {/* NOTES TEXTAREA */}
        <div>
          <label className="block mb-1">Notes</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {/* SUBMISSION SELECTION */}
        <Button type="submit">Submit</Button>
      </form>

      {/* SUCCESS POP-UP ALERT */}
      <PopupAlert
        open={successAlert}
        onOpenChange={setSuccessAlert}
        title="Activity Submitted"
        description="Your activity has been successfully logged."
      />

      {/* ERROR POP-UP ALERT */}
      <PopupAlert
        open={errorAlert}
        onOpenChange={setErrorAlert}
        title="Invalid Information"
        description={errorMessage}
      />
    </>
  )
}

export default ActivityForm
