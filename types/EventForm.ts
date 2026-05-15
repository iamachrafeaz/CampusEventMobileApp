import { EventCategory } from '@/types/EventCategory';

export type EventForm = {
  title: string;
  locationName: string;
  organizerName?: string;
  capacity?: string;
  description: string;
  category: EventCategory | null;
  startDateTime: Date | null;
  endDateTime: Date | null;
  locationAddress: string;
  imageUrl: string;
  tags: string[];
};
