import { useState } from "react"
import { ComboBox } from "./ComboBox"
import { Slider } from "./ui/slider"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import TimeInput from "./TimeInput"

type ActivityFormProps = {
  date: Date
}

function ActivityForm({ date }: ActivityFormProps) {
  const [category, setCategory] = useState("")
  const [mood, setMood] = useState("")
  const [energy, setEnergy] = useState(5)
  const [startTime, setStartTime] = useState("10:30")
  const [endTime, setEndTime] = useState("12:30")
  const [notes, setNotes] = useState("")

  const getDuration = () => {
    if (!startTime || !endTime) return ""
    const start = new Date(`1970-01-01T${startTime}`)
    const end = new Date(`1970-01-01T${endTime}`)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60)
    const hrs = Math.floor(diff / 60)
    const mins = diff % 60
    return `${hrs}h ${mins}m`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ category, mood, energy, startTime, endTime, notes })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white w-full h-full">
      <h2 className="text-xl font-semibold">Log Activity</h2>

      <ComboBox
        options={[
          { value: "work", label: "Work" },
          { value: "rest", label: "Rest" },
          { value: "hangout", label: "Hangout" },
        ]}
        value={category}
        onchange={setCategory}
        placeholder="Category"
        className="w-full"
        custom
      />

      <ComboBox
        options={[
          { value: "tired", label: "Tired" },
          { value: "happy", label: "Happy" },
          { value: "angry", label: "Angry" },
        ]}
        value={mood}
        onchange={setMood}
        placeholder="Mood"
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
