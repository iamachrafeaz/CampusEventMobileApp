import * as Crypto from 'expo-crypto';
import { db } from './db';

export const registerToEvent = async (eventId: string, userId: string) => {
    return await db.runAsync('INSERT INTO registrations (id,eventId, userId, createdAt) VALUES (?,?,?,?)',
        [Crypto.randomUUID(),eventId, userId, new Date().toISOString()]
    )
}

export const cancelRegistration = async (id: string) => {
    return await db.runAsync('UPDATE registrations SET status = ? WHERE id = ?',
        ['cancelled', id]
    )
}

export const getMyRegistrations = async (userId: string) => {    
  return await db.getAllAsync(
    `SELECT r.id , e.title, r.userId, r.eventId, e.startDateTime, e.locationName, r.createdAt, r.status
     FROM events e
     JOIN registrations r ON r.eventId = e.id
     WHERE r.userId = ?`,
    [userId]
  );
};

export const getRegistrationById = async (id : string) => {
    return await db.getFirstAsync("SELECT * FROM registrations WHERE id = ?", [id])
}

export const isAlreadyRegistered = async (eventId: string, userId: string) => {
  return await db.getFirstAsync(
    "SELECT * FROM registrations WHERE eventId = ? AND userId = ?",
    [eventId, userId]
  )
}