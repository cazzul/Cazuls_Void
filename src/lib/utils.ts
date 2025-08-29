import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getWeekDates(date: Date = new Date()): Date[] {
  // Get the current date
  const currentDate = new Date(date)
  
  // Find the start of the week (Sunday)
  const startOfWeek = new Date(currentDate)
  const dayOfWeek = currentDate.getDay()
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek)
  
  // Generate array of 7 days starting from Sunday
  const week = []
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek)
    dayDate.setDate(startOfWeek.getDate() + i)
    week.push(dayDate)
  }
  
  return week
}

export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date()
  const startOfWeek = new Date(today)
  const dayOfWeek = today.getDay()
  startOfWeek.setDate(today.getDate() - dayOfWeek)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  return { start: startOfWeek, end: endOfWeek }
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isCurrentWeek(date: Date): boolean {
  const { start, end } = getCurrentWeekRange()
  return date >= start && date <= end
}

export function getDayName(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)
}

export function getShortDayName(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
} 