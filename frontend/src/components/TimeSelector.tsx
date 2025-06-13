import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * Props for a reusable time selector.
 */
type TimeSelectorProps = {
  date: Date
  setDate: (val: Date) => void
  start: string
  end: string
  setStart: (val: string) => void
  setEnd: (val: string) => void
  dateSelectorClassname?: string
  timeSelectorClassname?: string
}

export default function TimeSelector({
  date,
  setDate,
  start,
  end,
  setStart,
  setEnd,
  dateSelectorClassname,
  timeSelectorClassname,
}: TimeSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={`w-full justify-between font-normal ${dateSelectorClassname ?? ""}`}
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate)
                  setOpen(false)
                }

              }}
              className="rounded-lg border shadow-sm"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className={`flex gap-4 ${timeSelectorClassname ?? ""}`}>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-from" className="px-1">
            From
          </Label>
          <Input
            type="time"
            id="time-from"
            step="60"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-to" className="px-1">
            To
          </Label>
          <Input
            type="time"
            id="time-to"
            step="60"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  )
}
