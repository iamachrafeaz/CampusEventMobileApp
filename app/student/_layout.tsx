import { useAuthStore } from "@/store/useAuthStore";
import { Redirect, Tabs } from "expo-router";
import { BotMessageSquare, CircleUser, Home, PenLine, Star } from "lucide-react-native";

export default function StudentLayout() {
  const { isLoggedIn, userType, isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return null;
  }

  if (!isLoggedIn || userType !== "STUDENT") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="registrations"
        options={{
          title: "Inscriptions",
          tabBarIcon: ({ color, size }) => <PenLine color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color, size }) => <BotMessageSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <CircleUser color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}