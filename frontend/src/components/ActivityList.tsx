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

type ActivityListProps = {
    activities: Activity[]
}

function ActivityList({ activities }: ActivityListProps) {
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
                    activities.map(a => (
                        <TableRow key={a.id}>
                            <TableCell>{a.start_time}-{a.end_time}</TableCell>
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
                                        <DropdownMenuItem className="flex items-center gap-2">
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
    )
}

export default ActivityList
