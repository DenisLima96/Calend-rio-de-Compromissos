export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  color?: string
  allDay?: boolean
}

export interface EventFormData {
  title: string
  description: string
  start: string
  end: string
  startTime: string
  endTime: string
  color: string
  allDay: boolean
}

export type CalendarView = "month" | "week" | "day"
