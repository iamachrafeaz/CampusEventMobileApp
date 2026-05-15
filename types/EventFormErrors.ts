import { EventForm } from "@/types/EventForm";

export type EventFormErrors = Partial<Record<keyof EventForm, string>>
