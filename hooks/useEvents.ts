import { Event } from "@/models/event";
import { eventService } from "@/services/eventService";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore(s => s.user);

  const fetchEvents = async (withFavorite : boolean) => {
    try {
      setLoading(true);
      setError(null);

      let data;
     
      if(withFavorite){
        data = await eventService.getAllWithFavorite(userId!) as Event[]
      } else{
        data = await eventService.getAll() as Event[]
      }

      setEvents(data);

    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };


  return {
    events,
    loading,
    error,
    fetchEvents
  };
};