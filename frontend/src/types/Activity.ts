import type { CategoryRead } from "./Category"

export type ActivityBase = {
    notes?: string,
    start_time: string,
    end_time: string,
    energy_level: number,
    mood: string
}

export type ActivityCreate = ActivityBase & {
    category_id: number
}

export type ActivityRead = ActivityBase & {
    id: number
    category: CategoryRead
}
