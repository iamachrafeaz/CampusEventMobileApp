import { Registration } from "@/models/registration"
import { registrationService } from "@/services/registrationService"
import { create } from "zustand"

type RegistrationStore = {
    registrations: Registration[]
    loading: boolean
    isRegistered: (eventId: string, userId: string) => Promise<boolean>
    fetchRegistrations: (userId: string) => Promise<void>
    setRegistrations: (registrations: Registration[]) => void
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
    registrations: [],
    loading: false,
    isRegistered: async (eventId: string, userId: string) => {
        const res = await registrationService.alreadyRegistered(eventId, userId) ;
        return res ? true : false
    },
    fetchRegistrations: async (userId: string) => {
        set({ loading: true })

        try {
            const data = await registrationService.getMyAll(userId) as Registration[]
            set({ registrations: data })
        } finally {
            set({ loading: false })
        }
    },

    setRegistrations: (registrations) => set({ registrations }),
}))

export const invalidateRegistrations = async (userId: string) => {
    const data = await registrationService.getMyAll(userId) as Registration[]
    useRegistrationStore.getState().setRegistrations(data)
} 