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
import { useState, type SetStateAction, type Dispatch } from "react"
import { authFetch } from "@/lib/authFetch"
import type { CategoryCreate } from "@/types/Category"
import { PopupAlert } from "../PopupAlert"

type CategoryComboBoxProps = {
    options: ComboOption[]
    setOptions: Dispatch<SetStateAction<ComboOption[]>>
    value: ComboOption | null
    onChange: (val: ComboOption) => void
    className?: string
}

export function CategoryComboBox({
    options,
    setOptions,
    value,
    onChange,
    className,
}: CategoryComboBoxProps) {
    const API_URL = import.meta.env.VITE_BACKEND_URL

    // Open/Close state of Pop-up
    const [dialogOpen, setDialogOpen] = useState(false)

    // Form fields
    const [customValue, setCustomValue] = useState("")
    const [customColor, setCustomColor] = useState("#F87171")
    const [customDescription, setCustomDescription] = useState("")

    // Error Alert
    const [errorMessage, setErrorMessage] = useState("")
    const [errorAlert, setErrorAlert] = useState(false)

    // Success Alert
    const [successAlert, setSuccessAlert] = useState(false)


    const presetColors = [
        "#F87171", // red-400
        "#FB923C", // orange-400
        "#FACC15", // yellow-400
        "#4ADE80", // green-400
        "#22D3EE", // cyan-400
        "#60A5FA", // blue-400
        "#818CF8", // indigo-400
        "#A78BFA", // violet-400
        "#F472B6", // pink-400
        "#94A3B8", // slate-400
        "#FCD34D", // amber-300
        "#34D399", // emerald-400
        "#67E8F9", // sky-300
        "#C084FC", // purple-400
        "#FCA5A5", // rose-300
        "#FBCFE8", // pink-200 (light)
        "#E879F9", // fuchsia-400
        "#D8B4FE", // purple-300
        "#93C5FD", // blue-300
    ]


    const handleAddCustom = async () => {
        // FIELD VALIDATION
        // NAME CHECK
        if (!customValue.trim()) {
            setErrorMessage("Please enter a name for your category")
            setErrorAlert(true)
            return
        }

        // COLOR CHECK
        if (!customColor) {
            setErrorMessage("Please select a color for your category")
            setErrorAlert(true)
            return
        }

        // CREATE CONTENT OBJECT
        const content: CategoryCreate = {
            name: customValue,
            is_default: false,
            color: customColor,
            description: customDescription
        }

        try {
            // SEND REQUEST TO BACKEND
            const res = await authFetch(`${API_URL}/categories/`, {
                method: "POST",
                body: JSON.stringify(content),
            })

            console.log("here")

            // RESPONSE STATUS CHECK
            if (!res.ok) {
                const errorData = await res.json()
                setErrorMessage(errorData?.detail || "Failed to create category.")
                setErrorAlert(true)
                return
            }

            // PARSE THE NEW CATEGORY
            const createdCategory = await res.json()

            const newOption: ComboOption = {
                value: createdCategory.id.toString(),
                label: createdCategory.name,
            }

            // ADD CATEGORY TO LIST
            setOptions(prev => [...prev, newOption])
            onChange(newOption)

            // SUCCESS FEEDBACK
            setSuccessAlert(true)

            // RESET THE FORM
            setDialogOpen(false)
            setCustomValue("")
            setCustomColor("#F87171")
            setCustomDescription("")
        } catch (err) {
            // CATCHING UNDEFINED ERRORS
            console.error("Error creating category:", err)
            setErrorMessage("Something went wrong. Please try again.")
            setErrorAlert(true)
            return
        }
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
            <PopupAlert
            open={errorAlert}
            onOpenChange={setErrorAlert}
            description={errorMessage}
            title="Invalid Information"
            />

            <PopupAlert
            open={successAlert}
            onOpenChange={setSuccessAlert}
            title="Category Created"
            description={`Category has been created successfully!`}
            />
        </>
    )
}
