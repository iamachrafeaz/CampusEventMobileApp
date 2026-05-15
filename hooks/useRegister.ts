import { registrationService } from "@/services/registrationService";
import { useAuthStore } from "@/store/useAuthStore";
import { invalidateEvents } from "@/store/useEventStore";
import { invalidateRegistrations } from "@/store/useRegistrationStore";
import { useState } from "react";

export const useRegister = () => {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [unregisterLoading, setUnregisterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore(s => s.user);

  const register = async (eventId: string, userId: string) => {
    setRegisterLoading(true);
    setError(null);

    try {
      await registrationService.register(eventId, userId);
      invalidateEvents(userId!);
      invalidateRegistrations(userId)
    } catch (e) {
      setError("Failed to register");
      throw e;
    } finally {
      setRegisterLoading(false);
    }
  };

  const unregister = async (id: string, eventId: string) => {
    setUnregisterLoading(true);
    setError(null);

    try {
      await registrationService.unregister(id, eventId);
      invalidateEvents(userId!)

      return true
    } catch (e) {
      console.error(e);
      setError("Failed to unregister");
      return false
    } finally {
      setUnregisterLoading(false);
    }
  };

  return {
    register,
    unregister,
    registerLoading,
    unregisterLoading,
    error,
  };
};