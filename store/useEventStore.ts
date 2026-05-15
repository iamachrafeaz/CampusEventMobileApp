import { Event } from "@/models/event";
import { eventService } from "@/services/eventService";
import { create } from "zustand";

type EventStore = {
    events: Event[];
    loading: boolean;

    fetchEvents: (userId: string | null) => Promise<void>;
    setEvents: (events: Event[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
    events: [],
    loading: false,

    fetchEvents: async (userId: string | null) => {
        set({ loading: true });

        try {
            let data;

            if (userId) {
                data = await eventService.getAllWithFavorite(userId) as Event[];
            }else{
                data = await eventService.getAll() as Event[];
            }

            set({ events: data });
        } catch (e) {
            console.error(e)
        } finally {
            set({ loading: false });
        }
    },

    setEvents: (events) => set({ events }),
}));

export const invalidateEvents = async (userId: string) => {
    const data = await eventService.getAllWithFavorite(userId) as Event[];
    useEventStore.getState().setEvents(data);
};