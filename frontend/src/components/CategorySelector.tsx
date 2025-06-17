"use client"

import { useState } from "react"
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

const CATEGORY_OPTIONS = [
  "Study",
  "Work",
  "Social",
  "Exercise",
  "Reading",
  "Leisure",
]

export default function CategorySelectorButton() {
  const [open, setOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Filter"}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." className="h-9" />
          <CommandList>
            <CommandGroup>
              {CATEGORY_OPTIONS.map((cat) => (
                <CommandItem
                  key={cat}
                  onSelect={() => toggleCategory(cat)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(cat) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cat}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
