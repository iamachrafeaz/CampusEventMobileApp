import { useAuthStore } from "@/store/useAuthStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoggedIn, userType } = useAuthStore();

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  if (userType === "ADMIN") {
    return <Redirect href="/admin/home" />;
  }

  return <Redirect href="/student/home" />;
}
