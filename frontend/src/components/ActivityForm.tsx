import { useEffect, useState } from "react"
import { Slider } from "./ui/slider"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import TimeInput from "./TimeInput"
import { CategoryComboBox } from "./combobox/CategoryComboBox"
import { MoodComboBox } from "./combobox/MoodComboBox"
import type { Activity } from "@/types/Activity"
import type { ComboOption } from "./combobox/BaseComboBox"
import { authFetch } from "@/lib/authFetch"

type ActivityFormProps = {
    date: Date,
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>
}

function ActivityForm({ date, setActivities }: ActivityFormProps) {

    // Api url is saved as a environment variable
    const API_URL = import.meta.env.VITE_BACKEND_URL

    const [category, setCategory] = useState("")
    const [mood, setMood] = useState("")
    const [energy, setEnergy] = useState(5)
    const [startTime, setStartTime] = useState("10:30")
    const [endTime, setEndTime] = useState("12:30")
    const [notes, setNotes] = useState("")

    // Contains categories and moods for drop down
    const [categoryOptions, setCategoryOptions] = useState<ComboOption[]>([])
    const [moodOptions, setMoodOptions] = useState<ComboOption[]>([])

    const getDuration = () => {
        if (!startTime || !endTime) return ""
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
        console.log({ category, mood, energy, startTime, endTime, notes })

        const isoDate = date.toISOString().split("T")[0]
        const startIso = new Date(`${isoDate}T${startTime}`).toISOString()
        const endIso = new Date(`${isoDate}T${endTime}`).toISOString()

        // Create a new activity instance
        const content: Activity = {
            category: category,
            mood: mood,
            energy_level: energy,
            start_time: startIso,   // make sure this is ISO format
            end_time: endIso,
            notes: notes
        }
        // send to backend
        const response = await authFetch(`${API_URL}/activities/`, {
            method: "POST",
            body: JSON.stringify(content),
        })

        if (!response.ok) {
            console.error("Error submitting activity:", response.statusText)
            return
        }

        const created = await response.json()
        // Update activities
        setActivities(prev => [...prev, created])
        console.log("Activity created:", created)

        // update the setActivities here as well so ui is in sync

    }

    //TODO: delete this
    if (moodOptions && categoryOptions) {
        // console.log("have both options")
    }

    useEffect(() => {
        async function fetchCategoryAndMoodOptions() {
          try {
            const [categoryRes, moodRes] = await Promise.all([
              authFetch(`${API_URL}/categories/`),
              authFetch(`${API_URL}/moods/`)
            ])
      
            if (categoryRes.ok && moodRes.ok) {
              const categoryData = await categoryRes.json()
              const moodData = await moodRes.json()
      
              setCategoryOptions(
                categoryData.map((c: any) => ({
                  value: c.id,
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
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white w-full h-full">
            <h2 className="text-xl font-semibold">Log Activity</h2>

            <CategoryComboBox
                options={[
                    { value: "work", label: "Work" },
                    { value: "rest", label: "Rest" },
                    { value: "hangout", label: "Hangout" },
                ]}
                value={category}
                onChange={setCategory}
                className="w-full"
            />

            <MoodComboBox
                value={mood}
                onChange={setMood}
                className="w-full"
            />

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

            {/* Time Inputs */}
            <div className="flex gap-4">
                <TimeInput label="From" value={startTime} onChange={setStartTime} id="start-time" />
                <TimeInput label="To" value={endTime} onChange={setEndTime} id="end-time" />
            </div>

            {startTime && endTime && (
                <p className="text-sm text-gray-600">Duration: {getDuration()}</p>
            )}

            <div>
                <label className="block mb-1">Notes</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <Button type="submit">Submit</Button>
        </form>
    )
}

export default ActivityForm
