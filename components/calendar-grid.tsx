"use client"

import type { CalendarEvent, CalendarView } from "@/types/event"
import { getMonthDays, getWeekDays, isSameDay, isSameMonth, formatTime } from "@/utils/date-utils"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  currentDate: Date
  view: CalendarView
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function CalendarGrid({ currentDate, view, events, onDateClick, onEventClick }: CalendarGridProps) {
  const getDays = () => {
    switch (view) {
      case "month":
        return getMonthDays(currentDate)
      case "week":
        return getWeekDays(currentDate)
      case "day":
        return [currentDate]
      default:
        return []
    }
  }

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)

      // Check if the event spans this day
      return date >= new Date(eventStart.toDateString()) && date <= new Date(eventEnd.toDateString())
    })
  }

  const days = getDays()
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  if (view === "month") {
    return (
      <div className="border rounded-lg overflow-hidden">
        {/* Header with weekday names */}
        <div className="grid grid-cols-7 bg-muted">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b cursor-pointer hover:bg-muted/50 transition-colors",
                  !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                  isToday && "bg-blue-50 border-blue-200",
                )}
                onClick={() => onDateClick(day)}
              >
                <div className={cn("text-sm font-medium mb-1", isToday && "text-blue-600")}>{day.getDate()}</div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 truncate"
                      style={{ backgroundColor: event.color || "#3b82f6" }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      {event.allDay ? event.title : `${formatTime(new Date(event.start))} ${event.title}`}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} mais</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (view === "week") {
    return (
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-muted">
          {days.map((day, index) => {
            const isToday = isSameDay(day, new Date())
            return (
              <div key={index} className={cn("p-3 text-center", isToday && "bg-blue-100 text-blue-600 font-medium")}>
                <div className="text-sm font-medium">{weekDays[day.getDay()]}</div>
                <div className="text-lg">{day.getDate()}</div>
              </div>
            )
          })}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[400px] p-2 border-r cursor-pointer hover:bg-muted/50 transition-colors",
                  isToday && "bg-blue-50",
                )}
                onClick={() => onDateClick(day)}
              >
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-2 rounded text-white cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: event.color || "#3b82f6" }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      {!event.allDay && (
                        <div className="opacity-90">
                          {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Day view
  const dayEvents = getEventsForDay(currentDate)

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">
        {currentDate.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </h3>

      <div className="space-y-2">
        {dayEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum evento para este dia</p>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg text-white cursor-pointer hover:opacity-80"
              style={{ backgroundColor: event.color || "#3b82f6" }}
              onClick={() => onEventClick(event)}
            >
              <div className="font-medium">{event.title}</div>
              {event.description && <div className="text-sm opacity-90 mt-1">{event.description}</div>}
              {!event.allDay && (
                <div className="text-sm opacity-90 mt-1">
                  {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
