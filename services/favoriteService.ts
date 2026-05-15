import * as repo from "../database/favorites";

export const favoriteService = {
    favoriteEvent: async (eventId: string, userId: string) => {
        const isFavorited = await repo.isFavorited(eventId, userId);
        if (isFavorited) {
            return repo.deleteFavorite(eventId, userId)
        } else {
            return repo.favoriteEvent(eventId, userId)
        }
    }
}