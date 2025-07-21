import { BaseComboBox, type ComboOption } from "./BaseComboBox"
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
    const [customDescription, setCustomDescription] = useState("")

    // Error Alert
    const [errorMessage, setErrorMessage] = useState("")
    const [errorAlert, setErrorAlert] = useState(false)

    // Success Alert
    const [successAlert, setSuccessAlert] = useState(false)

    

    const handleAddCustom = async () => {
        // FIELD VALIDATION
        // NAME CHECK
        if (!customValue.trim()) {
            setErrorMessage("Please enter a name for your category")
            setErrorAlert(true)
            return
        }

        // CREATE CONTENT OBJECT
        const content: CategoryCreate = {
            name: customValue,
            is_default: false,
            color: "#FFFFFF",
            description: customDescription
        }

        try {
            // SEND REQUEST TO BACKEND
            const res = await authFetch(`${API_URL}/categories/`, {
                method: "POST",
                body: JSON.stringify(content),
            })

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
