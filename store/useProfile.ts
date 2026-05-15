import { Profile } from "@/models/profile"
import { create } from "zustand"

type ProfileStore = {
    profile: Profile | null,
    setProfile : (profile: Profile) => void 
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile : null,
    setProfile : (profile) => {set({profile : profile})}
}))