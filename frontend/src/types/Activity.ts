import type { ComboOption } from "@/components/combobox/BaseComboBox"
import type { CategoryRead } from "./Category"

export type ActivityBase = {
    notes?: string,
    start_time: string,
    end_time: string,
    energy_level: number,
}

export type ActivityCreate = ActivityBase & {
    category_id: number
    mood: string
}

export type ActivityRead = ActivityBase & {
    id: number
    category: CategoryRead
    mood: ComboOption
}
