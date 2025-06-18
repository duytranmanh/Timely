// components/ComboBox/BaseComboBox.tsx
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export type ComboOption = {
  value: string
  label: string
}

type BaseComboBoxProps = {
  options: ComboOption[]
  value: string
  onChange: (val: string) => void
  placeholder: string
  className?: string
}

export function BaseComboBox({
  options,
  value,
  onChange,
  placeholder,
  className,
}: BaseComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  const normalOptions = options.filter((o) => !o.value.startsWith("__"))
  const customOptions = options.filter((o) => o.value.startsWith("__"))

  return (
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
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
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
              {normalOptions.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  onSelect={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                >
                  {o.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === o.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}

              {customOptions.length > 0 && (
                <>
                  <CommandItem
                    disabled
                    className="py-1 text-xs text-muted-foreground cursor-default"
                  >
                    Custom
                  </CommandItem>
                  {customOptions.map((o) => (
                    <CommandItem
                      key={o.value}
                      value={o.value}
                      onSelect={() => {
                        onChange(o.value)
                        setOpen(false)
                      }}
                    >
                      {o.label}
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
