import { CalendarEvent } from "./EventCalendar";

export interface Schedule {
  day: string,
  events: CalendarEvent[]
}
