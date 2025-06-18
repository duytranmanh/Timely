import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import type { Activity } from "../types/Activity"
import TimeInput from "@/components/TimeInput"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ComboBox } from "@/components/ComboBox"
import { Button } from "@/components/ui/button"

type ActivityListProps = {
  activities: Activity[]
}

function ActivityList({ activities }: ActivityListProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Activity | null>(null)

  const openEditDialog = (activity: Activity) => {
    setSelected(activity)
    setOpen(true)
  }

  return (
    <>
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
                <TableCell>{a.start_time}–{a.end_time}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell>{a.mood}</TableCell>
                <TableCell>{a.energy_level}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => openEditDialog(a)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>

          {selected && (
            <form className="space-y-4">
              <ComboBox
                options={[
                  { value: "work", label: "Work" },
                  { value: "rest", label: "Rest" },
                  { value: "hangout", label: "Hangout" },
                ]}
                value={selected.category}
                onchange={(val) =>
                  setSelected((prev) => prev && { ...prev, category: val })
                }
                placeholder="Category"
                className="w-full"
              />

              <ComboBox
                options={[
                  { value: "happy", label: "Happy" },
                  { value: "tired", label: "Tired" },
                  { value: "angry", label: "Angry" },
                ]}
                value={selected.mood}
                onchange={(val) =>
                  setSelected((prev) => prev && { ...prev, mood: val })
                }
                placeholder="Mood"
                className="w-full"
              />

              <div>
                <label className="block mb-1">Energy Level: {selected.energy_level}/10</label>
                <Slider
                  value={[selected.energy_level]}
                  max={10}
                  onValueChange={(val) =>
                    setSelected((prev) => prev && { ...prev, energy_level: val[0] })
                  }
                />
              </div>

              <div className="flex gap-4">
                <TimeInput
                  id="start"
                  label="From"
                  value={selected.start_time}
                  onChange={(val) =>
                    setSelected((prev) => prev && { ...prev, start_time: val })
                  }
                />
                <TimeInput
                  id="end"
                  label="To"
                  value={selected.end_time}
                  onChange={(val) =>
                    setSelected((prev) => prev && { ...prev, end_time: val })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">Notes</label>
                <Textarea
                  value={selected.notes || ""}
                  onChange={(e) =>
                    setSelected((prev) => prev && { ...prev, notes: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActivityList
