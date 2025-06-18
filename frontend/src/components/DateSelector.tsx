import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  date: Date
  onChange: (d: Date) => void
}

export default function DateSelector({ date, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit justify-between font-normal">
            {format(date, "PP")}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 w-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(d)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
