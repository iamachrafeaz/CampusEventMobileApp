export const EventCategories = [
  "Talk",
  "Workshop",
  "Club",
  "Exam",
  "Other",
] as const;

export type EventCategory = (typeof EventCategories)[number];