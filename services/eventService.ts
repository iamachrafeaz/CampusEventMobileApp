import * as Crypto from 'expo-crypto';
import { File, Paths } from 'expo-file-system';
import * as Sharing from "expo-sharing";
import * as repo from "../database/events";
import { Event } from "../models/event";

type EventCategory = Event["category"];

type EventForm = {
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


export const eventService = {
  getAll: () => repo.getAllEvents(),

  getAllWithFavorite: async (userId: string) => await repo.getAllEventsWithFavorite(userId),

  getOneById: (id: string, userId: string | null = null) => {
    let event: Event;
    if (userId) {
      event = repo.getEventByIdIncluseUserState(id, userId) as Event
    }
    else {
      event = repo.getEventById(id) as Event
    }

    if (event.tags) {
      return { ...event, tags: event.tags.toString().split(",") };
    } else {
      return event
    }
  },

  create: async (form: EventForm, image: string | null) => {
    let imageUrl: string | undefined = undefined;

    if (image) {
      const fileName = `${Date.now()}.jpg`;

      const sourceFile = new File(image);
      const destFile = new File(Paths.document, fileName);

      await sourceFile.copy(destFile);

      imageUrl = destFile.uri;
    }

    const event: Event = {
      id: Crypto.randomUUID(),

      title: form.title,
      description: form.description,
      category: form.category!,

      locationName: form.locationName,
      locationAddress: form.locationAddress,

      startDateTime: form.startDateTime!.toISOString(),
      endDateTime: form.endDateTime?.toISOString() || "",

      organizerName: form.organizerName || undefined,
      capacity: form.capacity
        ? parseInt(form.capacity)
        : undefined,

      createdAt: new Date().toISOString(),

      imageUrl,
      tags: form.tags,
    };

    return repo.createEvent(event);
  },

  update: async (
    id: string,
    form: EventForm,
    image: string | null,
    isImageDeleted: boolean
  ) => {
    const originalEvent = repo.getEventById(id);

    if (!originalEvent) {
      throw new Error("Event not found");
    }

    let imageUrl = originalEvent.imageUrl;

    if (isImageDeleted) {
      imageUrl = undefined
    }

    if (image) {
      const fileName = `${Date.now()}.jpg`;

      const sourceFile = new File(image);
      const destFile = new File(Paths.document, fileName);

      await sourceFile.copy(destFile);

      imageUrl = destFile.uri;
    }

    const updatedEvent: Event = {
      ...originalEvent,
      id: id,
      title: form.title,
      description: form.description,
      category: form.category!,

      locationName: form.locationName,
      locationAddress: form.locationAddress,

      startDateTime: form.startDateTime!.toISOString(),
      endDateTime: form.endDateTime?.toISOString() || "",

      organizerName: form.organizerName || undefined,
      capacity: form.capacity
        ? parseInt(form.capacity)
        : undefined,

      imageUrl,
      tags: form.tags,
    };

    return await repo.updateEvent(updatedEvent);
  },

  delete: (id: string) => repo.deleteEvent(id),

  getFavoriteEvents: (userId: string) => repo.getFavoriteEvents(userId),

  exportEvents: async () => {
    try {
      const events = await repo.getAllEvents();
      const json = JSON.stringify(events, null, 2);

      const file = new File(Paths.document, "events.json")

      file.write(json)

      await Sharing.shareAsync(file.uri);
    } catch (error) {
      console.log("Export error:", error);
    }
  }
};