import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#666",
        tabBarActiveBackgroundColor: "#e6f0ff",
        tabBarInactiveBackgroundColor: "#f9f9f9",
        headerRight: () => (
          <>
            <TouchableOpacity
              onPress={() => router.push("/about")}
              style={{ paddingRight: 16 }}
            >
              <Ionicons name="help-circle-outline" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{ paddingRight: 16 }}
            >
              <Ionicons name="settings-outline" size={24} />
            </TouchableOpacity>
          </>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Welcome",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: "Share",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="share-social" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}
