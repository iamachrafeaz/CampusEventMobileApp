import { favoriteService } from "@/services/favoriteService";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export const useFavoriteEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore(s => s.user);

  const favorite = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);

      await favoriteService.favoriteEvent(eventId, userId!);
    } catch (err) {
      console.error(err);
      setError("Failed to favorite event");
    } finally {
      setLoading(false);
    }
  };

  return { favorite, loading, error };
};