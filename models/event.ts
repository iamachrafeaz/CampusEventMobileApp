import { EventCategory } from "@/constants/eventCategory";

export interface Event { 
  id: string
  title: string
  description: string
  category: EventCategory

  startDateTime: string
  endDateTime?: string

  locationName: string
  locationAddress?: string

  organizerName?: string
  capacity?: number 

  registeredCount?: number

  imageUrl?: string
  tags?: string[]

  createdAt: string

  isFavorited? : boolean,
  
  notificationId? : string
};