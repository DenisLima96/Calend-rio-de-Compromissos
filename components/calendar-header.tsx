"use client"

import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalendarView } from "@/types/event"

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: CalendarView) => void
  onCreateEvent: () => void
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onCreateEvent,
}: CalendarHeaderProps) {
  const formatTitle = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    } else if (view === "week") {
      return `Semana de ${currentDate.toLocaleDateString("pt-BR")}`
    } else {
      return currentDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold capitalize">{formatTitle()}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border">
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("month")}
            className="rounded-r-none"
          >
            Mês
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("week")}
            className="rounded-none border-x-0"
          >
            Semana
          </Button>
          <Button
            variant={view === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("day")}
            className="rounded-l-none"
          >
            Dia
          </Button>
        </div>

        <Button onClick={onCreateEvent} className="ml-2">
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>
    </div>
  )
}
