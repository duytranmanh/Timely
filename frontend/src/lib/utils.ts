import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: string): string {
  const dateIso = new Date(date)

  const format = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return `${format.format(dateIso)}`
}

export const getColorForCategory = (() => {
  const assigned = new Map<string, string>()
  const chartCount = 8

  return (name: string) => {
    if (!name || name === "undefined") return "#D1D5DB" // gray-400
    if (assigned.has(name)) return assigned.get(name)!
    const index = assigned.size % chartCount
    const color = `var(--chart-${index + 1})`
    assigned.set(name, color)
    return color
  }
})()