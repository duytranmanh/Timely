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
  
  type ActivityListProps = {
    activities: ActivityRead[]
  }
  
  function ActivityList({ activities }: ActivityListProps) {


    const handleDelete = (id: number) => {
      if (!id) {
        console.log("activity isnt available")
      }

      console.log("Delete activity with id:", id)
      // TODO: call delete API and refresh list
    }
  
    return (
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
    )
  }
  
  export default ActivityList
  