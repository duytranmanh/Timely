import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ComboOption = {
  value: string
  label: string
}

type ComboBoxProps = {
  options: ComboOption[]
  value: string
  onchange: (val: string) => void
  placeholder: string
  className?: string
  custom?: boolean
}

export function ComboBox({
  options,
  value,
  onchange,
  placeholder,
  className,
  custom = false,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [customValue, setCustomValue] = React.useState("")

  const handleAddCustom = () => {
    if (!customValue.trim()) return
    onchange(customValue)
    setDialogOpen(false)
    setCustomValue("")
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
          >
            {value
              ? options.find((opt) => opt.value === value)?.label || value
              : `Select ${placeholder}`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No {placeholder} found.</CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.value}
                    onSelect={(currentValue) => {
                      onchange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {o.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === o.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                {custom && (
                  <CommandItem
                    className="text-primary cursor-pointer"
                    onSelect={() => {
                      setOpen(false)
                      setDialogOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add custom {placeholder.toLowerCase()}
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom {placeholder}</DialogTitle>
          <DialogDescription>
            Type your custom {placeholder.toLowerCase()} below:
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder={`e.g., Gym, Study, Meditation`}
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCustom}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
