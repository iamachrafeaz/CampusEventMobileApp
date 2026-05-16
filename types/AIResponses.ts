import { CalendarEvent } from "./EventCalendar";
import { Schedule } from "./Schedule";

export interface AIResponseRecommend {
  opening: string;
  content: CalendarEvent[] 
  closing: string;
}

export interface AIResponseSearch {
  opening: string;
  content: CalendarEvent[] 
  closing: string;
}

export interface AIResponsePlan {
  opening: string;
  content: Schedule[] 
  closing: string;
}