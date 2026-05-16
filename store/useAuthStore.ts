import { UserType } from "@/types/UserType";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";

const AUTH_SESSION_KEY = "@CampusEvents:authSession";

type AuthSession = {
  userType: UserType;
  user: string;
};

type AuthState = {
  userType: UserType | null;
  isLoggedIn: boolean;
  isAuthReady: boolean;
  login: (userType: UserType, user : string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  user : string | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  userType: null,
  user: null,
  isLoggedIn: false,
  isAuthReady: false,
  login: async (userType, user) => {
    const session: AuthSession = { userType, user };
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    set({ isLoggedIn: true, userType, user });
  },
  logout: async () => {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
    set({ isLoggedIn: false, userType: null, user: null });
  },
  initializeAuth: async () => {
    try {
      const sessionString = await AsyncStorage.getItem(AUTH_SESSION_KEY);
      if (sessionString) {
        const session = JSON.parse(sessionString) as AuthSession;
        set({ isLoggedIn: true, userType: session.userType, user: session.user });
      }
    } catch (error) {
      console.warn("Failed to load auth session", error);
    } finally {
      set({ isAuthReady: true });
    }
  },
}));