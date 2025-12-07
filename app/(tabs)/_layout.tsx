import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#666",
        tabBarActiveBackgroundColor: "#e6f0ff",
        tabBarInactiveBackgroundColor: "#f9f9f9",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "CALENDAR",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: "SHARE",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="share-social" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}
