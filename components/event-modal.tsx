"use client"

import type { CalendarEvent, EventFormData } from "@/types/event"
import { EventForm } from "./event-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Edit } from "lucide-react"
import { formatDateTime } from "@/utils/date-utils"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent | null
  mode: "view" | "create" | "edit"
  onSubmit: (data: EventFormData) => void
  onDelete?: () => void
  onEdit?: () => void
}

export function EventModal({ isOpen, onClose, event, mode, onSubmit, onDelete, onEdit }: EventModalProps) {
  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Criar Novo Evento"
      case "edit":
        return "Editar Evento"
      case "view":
        return event?.title || "Detalhes do Evento"
      default:
        return "Evento"
    }
  }

  if (mode === "view" && event) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {event.description && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Descrição</h4>
                <p className="text-sm">{event.description}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Data e Hora</h4>
              <p className="text-sm">
                {event.allDay
                  ? `${formatDateTime(event.start).split(" ")[0]} - Dia inteiro`
                  : `${formatDateTime(event.start)} - ${formatDateTime(event.end)}`}
              </p>
            </div>

            {event.color && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Cor</h4>
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: event.color }} />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <EventForm event={event} onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
