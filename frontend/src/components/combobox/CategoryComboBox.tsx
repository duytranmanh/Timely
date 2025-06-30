import { BaseComboBox, type ComboOption } from "./BaseComboBox"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

type CategoryComboBoxProps = {
    options: ComboOption[]
    value: ComboOption | null
    onChange: (val: ComboOption) => void
    className?: string
}

export function CategoryComboBox({
    options,
    value,
    onChange,
    className,
}: CategoryComboBoxProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [customValue, setCustomValue] = useState("")
    const [customColor, setCustomColor] = useState("#F87171")
    const [customDescription, setCustomDescription] = useState("")

    const presetColors = [
        "#F87171", // red
        "#FBBF24", // yellow
        "#34D399", // green
        "#60A5FA", // blue
        "#A78BFA", // purple
    ]

    const handleAddCustom = () => {
        if (!customValue.trim()) return
        // TODO: Send POST to backend
        // onChange(customValue)
        setDialogOpen(false)
        setCustomValue("")
        setCustomColor("#F87171")
        setCustomDescription("")
    }

    return (
        <>
            <BaseComboBox
                options={[
                    ...options,
                    { value: "__add_new__", label: "Add custom category" },
                ]}
                value={value?.value || ""}
                onChange={(val) => {
                    if (val === "__add_new__") setDialogOpen(true)
                    else {
                        const selected = options.find(opt => opt.value === val)
                        if (selected) onChange(selected)
                      }
                }}
                placeholder="Category"
                className={className}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Custom Category</DialogTitle>
                        <DialogDescription>
                            Create a new category with a color and optional description.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Input
                            placeholder="Category name"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2">
                            {presetColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setCustomColor(color)}
                                    className={cn(
                                        "w-6 h-6 rounded-full border-2 transition-transform",
                                        customColor === color ? "border-black scale-110" : "border-transparent"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>


                        <Textarea
                            placeholder="Optional description"
                            value={customDescription}
                            onChange={(e) => setCustomDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddCustom}>Add</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
