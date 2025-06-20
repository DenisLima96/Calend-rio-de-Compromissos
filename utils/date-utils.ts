export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR")
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("pt-BR")
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

export function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))

  const days: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

export function getWeekDays(date: Date): Date[] {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push(day)
  }

  return days
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

export function addWeeks(date: Date, weeks: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + weeks * 7)
  return newDate
}
