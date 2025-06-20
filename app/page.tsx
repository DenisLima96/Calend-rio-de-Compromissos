"use client"

import { useState } from "react"
import { useCalendar } from "@/hooks/use-calendar"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarGrid } from "@/components/calendar-grid"
import { EventModal } from "@/components/event-modal"
import { SearchBar } from "@/components/search-bar"
import type { CalendarEvent, EventFormData } from "@/types/event"
import { addMonths, addWeeks } from "@/utils/date-utils"
import { useToast } from "@/hooks/use-toast"

type ModalMode = "view" | "create" | "edit"

export default function CalendarApp() {
  const {
    events,
    currentDate,
    setCurrentDate,
    view,
    setView,
    searchQuery,
    setSearchQuery,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendar()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>("view")
  const { toast } = useToast()

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, -1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, -1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 1)
      setCurrentDate(newDate)
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 1)
      setCurrentDate(newDate)
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    if (view !== "day") {
      setView("day")
    }
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEventSubmit = (data: EventFormData) => {
    try {
      const startDateTime = data.allDay ? new Date(data.start) : new Date(`${data.start}T${data.startTime}`)

      const endDateTime = data.allDay ? new Date(data.end) : new Date(`${data.end}T${data.endTime}`)

      const eventData = {
        title: data.title,
        description: data.description,
        start: startDateTime,
        end: endDateTime,
        color: data.color,
        allDay: data.allDay,
      }

      if (modalMode === "create") {
        addEvent(eventData)
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso!",
        })

        // Simular notificação por email
        console.log("📧 Email enviado:", {
          to: "usuario@exemplo.com",
          subject: `Novo evento: ${data.title}`,
          body: `Você tem um novo evento agendado para ${startDateTime.toLocaleString("pt-BR")}`,
        })
      } else if (modalMode === "edit" && selectedEvent) {
        updateEvent(selectedEvent.id, eventData)
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso!",
        })
      }

      setIsModalOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive",
      })
    }
  }

  const handleEventDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id)
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso!",
      })
      setIsModalOpen(false)
      setSelectedEvent(null)
    }
  }

  const handleEventEdit = () => {
    setModalMode("edit")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Meu Calendário</h1>
          <div className="max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar eventos..." />
          </div>
        </div>

        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={setView}
          onCreateEvent={handleCreateEvent}
        />

        <CalendarGrid
          currentDate={currentDate}
          view={view}
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          mode={modalMode}
          onSubmit={handleEventSubmit}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}
        />
      </div>
    </div>
  )
}
