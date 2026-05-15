import { favoriteService } from "@/services/favoriteService";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export const useFavoriteEvent = () => {
  const [loading, setLoading] = useState(false);
  const userId = useAuthStore(s => s.user);

  const favorite = async (eventId: string) => {
    try {
      setLoading(true);

      await favoriteService.favoriteEvent(eventId, userId!);
    } catch (err) {
      console.error(err);
      throw new Error("Erreur")
    } finally {
      setLoading(false);
    }
  };

  return { favorite, loading };
};