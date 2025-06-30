import type { ActivityRead } from "@/types/Activity"

/**
 * Checks if a time range is valid
 * @param start Starting time in ISO format
 * @param end Ending time in ISO format
 * @returns True if ending time is larger or equal to starting time, False otherwise
 */
export function isTimeRangeValid(start: string, end: string): boolean {
  const s = new Date(`1970-01-01T${start}`)
  const e = new Date(`1970-01-01T${end}`)
  return e >= s
}

/**
 * Checks if a new activities overlaps with any existing activities timewise
 * @param newStartIso New activity starting time in ISO format
 * @param newEndIso New activity ending time in ISO format
 * @param existingActivities List of logged activities
 * @returns True if activity overlaps with any existing activities, False otherwise
 */
export function hasOverlap(
  newStartIso: string,
  newEndIso: string,
  existingActivities: ActivityRead[]
): boolean {
  const newStart = new Date(newStartIso).getTime()
  const newEnd = new Date(newEndIso).getTime()

  return existingActivities.some((act) => {
    const actStart = new Date(act.start_time).getTime()
    const actEnd = new Date(act.end_time).getTime()
    return newStart < actEnd && newEnd > actStart
  })
}
