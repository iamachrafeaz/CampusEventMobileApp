import { getEventByIdIncluseUserState, updateRegisteredCount } from "@/database/events";
import * as repo from "@/database/registrations";
import { Event } from "@/models/event";

export const registrationService = {
    register: async (eventId: string, userId: string) => {
        let result

        try {
            const event = await getEventByIdIncluseUserState(eventId, userId) as Event

            const isFull =
                event.capacity != null &&
                event.registeredCount != null &&
                event.registeredCount >= event.capacity

            const isPast =
                new Date(event.startDateTime).getTime() < Date.now()

            const alreadyRegistered = await repo.isAlreadyRegistered(eventId, userId)

            if (isPast || isFull) {
                throw new Error("Can't register.")
            }

            if (alreadyRegistered) {
                throw new Error("Already registered.")
            }

            // insert
            result = await repo.registerToEvent(eventId, userId)

            if (!result?.lastInsertRowId) {
                throw new Error("Insert failed")
            }

            await updateRegisteredCount(eventId, true)

        } catch (err) {
            // rollback if insert happened
            if (result?.lastInsertRowId) {
                await repo.cancelRegistration(result.lastInsertRowId.toString())
            }

            throw err
        }
    },

    unregister: async (id: string, eventId: string) => {
        await repo.cancelRegistration(id);
        await updateRegisteredCount(eventId, false);
    },
    alreadyRegistered : async (eventId: string, userId: string) => await repo.isAlreadyRegistered(eventId, userId),

    getMyAll: async (userId: string) => {
        return await repo.getMyRegistrations(userId)
    }
}