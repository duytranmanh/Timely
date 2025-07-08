"use client"

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComboOption } from "./combobox/BaseComboBox"

type CategorySelectorButtonProps = {
  categoryOptions: ComboOption[]
  selectedCategories: string[] // This holds .value (e.g. category IDs)
  setSelectedCategories: (cats: string[]) => void
  maxSelected?: number
}

export default function CategorySelectorButton({
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  maxSelected = 3,
}: CategorySelectorButtonProps) {
  const toggleCategory = (catValue: string) => {
    const isSelected = selectedCategories.includes(catValue)
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catValue))
    } else if (selectedCategories.length < maxSelected) {
      setSelectedCategories([...selectedCategories, catValue])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          {selectedCategories.length > 0
            ? `${selectedCategories.length} selected`
            : "Filter"}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." className="h-9" />
          <CommandList>
            <CommandGroup>
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategories.includes(cat.value)
                const disableAdd = !isSelected && selectedCategories.length >= maxSelected

                return (
                  <CommandItem
                    key={cat.value}
                    onSelect={() => toggleCategory(cat.value)}
                    disabled={disableAdd}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cat.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
