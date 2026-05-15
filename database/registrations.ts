import * as Crypto from 'expo-crypto';
import { db } from './db';

export const registerToEvent = (eventId: string, userId: string) => {
  return db.runAsync('INSERT INTO registrations (id,eventId, userId, createdAt) VALUES (?,?,?,?)',
    [Crypto.randomUUID(), eventId, userId, new Date().toISOString()]
  )
}

export const cancelRegistration = (id: string) => {
  return db.runAsync('UPDATE registrations SET status = ? WHERE id = ?',
    ['cancelled', id]
  )
}

export const getMyRegistrations = (userId: string) => {
  return db.getAllAsync(
    `SELECT r.id , e.title, r.userId, r.eventId, e.startDateTime, e.locationName, r.createdAt, r.status
     FROM events e
     JOIN registrations r ON r.eventId = e.id
     WHERE r.userId = ?`,
    [userId]
  );
};

export const getRegistrationById = (id: string) => {
  return db.getFirstAsync("SELECT * FROM registrations WHERE id = ?", [id])
}

export const isAlreadyRegistered = (eventId: string, userId: string) => {
  return db.getFirstAsync(
    "SELECT * FROM registrations WHERE eventId = ? AND userId = ?",
    [eventId, userId]
  )
}