import { UserType } from "@/types/UserType";
import { create } from "zustand";

type AuthState = {
  userType: UserType | null;
  isLoggedIn: boolean;
  login: (userType: UserType, user : string) => void;
  logout: () => void;
  user : string | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  userType: null,
  user : null,
  isLoggedIn: false,
  login: (userType, user) => set({ isLoggedIn: true, userType, user : user }),
  logout: () => set({ isLoggedIn: false,
    userType: null,
    user: null,}),
}));