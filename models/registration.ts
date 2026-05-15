export type RegistrationStatus = 'confirmed' | 'cancelled';

export interface Registration {
  userId: string;
  id: string;
  title: string;
  locationName: string;
  eventId : string;
  startDateTime : string;
  createdAt: string;
  status: RegistrationStatus;
}