"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { CalendarEvent, EventFormData } from "@/types/event"

interface EventFormProps {
  event?: CalendarEvent | null
  onSubmit: (data: EventFormData) => void
  onCancel: () => void
}

const colorOptions = [
  { value: "#3b82f6", label: "Azul" },
  { value: "#ef4444", label: "Vermelho" },
  { value: "#10b981", label: "Verde" },
  { value: "#f59e0b", label: "Amarelo" },
  { value: "#8b5cf6", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
]

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    start: "",
    end: "",
    startTime: "09:00",
    endTime: "10:00",
    color: "#3b82f6",
    allDay: false,
  })

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)

      setFormData({
        title: event.title,
        description: event.description,
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        color: event.color || "#3b82f6",
        allDay: event.allDay || false,
      })
    } else {
      const today = new Date()
      setFormData((prev) => ({
        ...prev,
        start: today.toISOString().split("T")[0],
        end: today.toISOString().split("T")[0],
      }))
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Digite o título do evento"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Digite a descrição do evento"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="allDay" checked={formData.allDay} onCheckedChange={(checked) => handleChange("allDay", checked)} />
        <Label htmlFor="allDay">Evento de dia inteiro</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start">Data de início *</Label>
          <Input
            id="start"
            type="date"
            value={formData.start}
            onChange={(e) => handleChange("start", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="end">Data de fim *</Label>
          <Input
            id="end"
            type="date"
            value={formData.end}
            onChange={(e) => handleChange("end", e.target.value)}
            required
          />
        </div>
      </div>

      {!formData.allDay && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Hora de início</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Hora de fim</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <Label>Cor do evento</Label>
        <div className="flex gap-2 mt-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color.value ? "border-gray-800" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleChange("color", color.value)}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{event ? "Atualizar" : "Criar"} Evento</Button>
      </div>
    </form>
  )
}
