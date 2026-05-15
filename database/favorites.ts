import { db } from "./db";

export const favoriteEvent = (eventId: string, userId: string) => {
    return db.runAsync(
        `INSERT INTO favorites (eventId, userId, createdAt)
   VALUES (?, ?, ?)`,
        [eventId, userId, new Date().toISOString()]
    );
}

export const deleteFavorite = (eventId: string, userId: string) => {
    return db.runAsync(
        `DELETE FROM favorites WHERE eventId = ? AND userId = ?`,
        [eventId, userId]
    );
}

export const isFavorited = (eventId: string, userId: string) => {
    return db.getFirstAsync(
        `SELECT eventId FROM favorites WHERE eventId = ? AND userId = ?`,
        [eventId, userId]
    );
};