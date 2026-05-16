import { Event } from "../models/event";
import { db } from "./db";

/* Create */

export const createEvent = (event: Event) => {
  return db.runAsync(
    `INSERT INTO events (
      id, title, description, category,
      startDateTime, endDateTime,
      locationName, locationAddress,
      organizerName, capacity,
      registeredCount, imageUrl,
      tags, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [event.id,
    event.title,
    event.description,
    event.category,
    event.startDateTime,
    event.endDateTime ?? null,
    event.locationName,
    event.locationAddress ?? null,
    event.organizerName ?? null,
    event.capacity ?? null,
    event.registeredCount ?? 0,
    event.imageUrl ?? null,
    event.tags?.toString() ?? null,
    event.createdAt,
    ]
  );
};

/* Delete */

export const deleteEvent = (eventId: string) => {
  return db.runAsync('DELETE FROM events WHERE id = ?', [eventId])
}

/* Get Multiple Events */

export const getAllEvents = () => {
  return db.getAllAsync('SELECT * FROM events')
};

export const getAllEventsWithFavorite = async (userId: string) => {
  return await db.getAllAsync(`
    SELECT 
      e.id,
      e.title,
      e.startDateTime,
      e.locationName,
      e.description,
      e.category,
      e.registeredCount,
      e.capacity,
      e.createdAt,
      CASE 
        WHEN f.eventId IS NOT NULL THEN 1 
        ELSE 0 
      END as isFavorited
    FROM events e
    LEFT JOIN favorites f 
      ON e.id = f.eventId AND f.userId = ?
      ORDER BY e.startDateTime DESC
  `, [userId]);
};

export const getActiveEvents = async () => {
  return await db.getAllAsync(`
    SELECT *
    FROM events
    WHERE (capacity IS NULL OR capacity > registeredCount)
    AND startDateTime > datetime('now')
    ORDER BY startDateTime ASC
  `);
};

export const getFavoriteEvents = (userId: string) => {
  return db.getAllAsync(`
    SELECT e.*,
    CASE 
        WHEN f.eventId IS NOT NULL THEN 1 
        ELSE 0 
    END as isFavorited
    FROM events AS e
    LEFT JOIN favorites f ON e.id = f.eventId 
    WHERE f.userId = ?`,
    [userId])
}

/* Get Single Event */

export const getEventById = (eventId: string) => {
  return db.getFirstAsync(
    `SELECT e.* 
     FROM events AS e 
     WHERE e.id = ?`,
    [eventId]
  );
};

export const getEventByIdWithFavorite = (eventId: string, userId: string) => {
  return db.getFirstAsync(
    `SELECT e.*, 
      CASE 
        WHEN f.eventId IS NOT NULL THEN 1 
        ELSE 0 
      END as isFavorited
     FROM events AS e 
     LEFT JOIN favorites f 
       ON e.id = f.eventId AND f.userId = ?
     WHERE e.id = ?`,
    [userId, eventId]
  );
};


/* Update */

export const updateEvent = async (event: Event) => {
  return await db.runAsync(
    `UPDATE events SET
      title = ?,
      description = ?,
      category = ?,
      startDateTime = ?,
      endDateTime = ?,
      locationName = ?,
      locationAddress = ?,
      organizerName = ?,
      capacity = ?,
      registeredCount = ?,
      imageUrl = ?,
      tags = ?,
      createdAt = ?
    WHERE id = ?`,
    [
      event.title,
      event.description,
      event.category,
      event.startDateTime,
      event.endDateTime ?? null,
      event.locationName,
      event.locationAddress ?? null,
      event.organizerName ?? null,
      event.capacity ?? null,
      event.registeredCount ?? 0,
      event.imageUrl ?? null,
      event.tags ? JSON.stringify(event.tags) : null,
      event.createdAt,
      event.id,
    ]
  );
};


export const updateRegisteredCount = (eventId: string, isIncrement: boolean) => {
  return db.runAsync(
    `UPDATE events
     SET registeredCount = registeredCount ${isIncrement ? '+' : '-'} 1
     WHERE id = ?`,
    [eventId]
  );
};