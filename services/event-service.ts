import type { CalendarEvent } from "@/types/event"

const STORAGE_KEY = "calendar-events"

export class EventService {
  static getEvents(): CalendarEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const events = JSON.parse(stored)
      return events.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }))
    } catch (error) {
      console.error("Error loading events:", error)
      return []
    }
  }

  static saveEvents(events: CalendarEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events:", error)
    }
  }

  static addEvent(event: Omit<CalendarEvent, "id">): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    }

    const events = this.getEvents()
    events.push(newEvent)
    this.saveEvents(events)

    return newEvent
  }

  static updateEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const events = this.getEvents()
    const index = events.findIndex((event) => event.id === id)

    if (index === -1) return null

    events[index] = { ...events[index], ...updates }
    this.saveEvents(events)

    return events[index]
  }

  static deleteEvent(id: string): boolean {
    const events = this.getEvents()
    const filteredEvents = events.filter((event) => event.id !== id)

    if (filteredEvents.length === events.length) return false

    this.saveEvents(filteredEvents)
    return true
  }

  static searchEvents(query: string): CalendarEvent[] {
    const events = this.getEvents()
    const lowercaseQuery = query.toLowerCase()

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowercaseQuery) || event.description.toLowerCase().includes(lowercaseQuery),
    )
  }
}
