"use client"

import { useState, useEffect, useCallback } from "react"
import type { CalendarEvent, CalendarView } from "@/types/event"
import { EventService } from "@/services/event-service"

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadedEvents = EventService.getEvents()
    setEvents(loadedEvents)
  }, [])

  const addEvent = useCallback((eventData: Omit<CalendarEvent, "id">) => {
    const newEvent = EventService.addEvent(eventData)
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }, [])

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    const updatedEvent = EventService.updateEvent(id, updates)
    if (updatedEvent) {
      setEvents((prev) => prev.map((event) => (event.id === id ? updatedEvent : event)))
    }
    return updatedEvent
  }, [])

  const deleteEvent = useCallback((id: string) => {
    const success = EventService.deleteEvent(id)
    if (success) {
      setEvents((prev) => prev.filter((event) => event.id !== id))
    }
    return success
  }, [])

  const searchEvents = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (!query.trim()) return events
      return EventService.searchEvents(query)
    },
    [events],
  )

  const filteredEvents = searchQuery.trim() ? searchEvents(searchQuery) : events

  return {
    events: filteredEvents,
    currentDate,
    setCurrentDate,
    view,
    setView,
    selectedEvent,
    setSelectedEvent,
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    addEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
  }
}
