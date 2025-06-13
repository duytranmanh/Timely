"use client"

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
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * Basic value-label pair for options
 */
type ComboOption = {
    "value": string, 
    "label": string
}

/**
 * Define necessary props for ComboBox
 * @param options: Value-label pairs of options for the drop down
 * @param value: Value that is selected
 * @param onchange: Function to change value
 * @param placeholder: Type being selected (capitalized)
 * @param className: Tailwind className
 */
type ComboBoxProps = {
    options: ComboOption[],             
    value: string,                      
    onchange: (val: string) => void,   
    placeholder: string,                
    className?: string                  
}

export function ComboBox({options, value, onchange, placeholder, className}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)

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
            ? options.find((opt) => opt.value === value)?.label
            : `Select ${placeholder}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={options[0]?.label || ""} className="h-9" />
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
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
