import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#555",
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#ddd" },
        headerShown: false,
      }}
    >
      {/* Overview first */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Countdown second */}
      <Tabs.Screen
        name="countdown"
        options={{
          title: "Countdown",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Settings third */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Instellingen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      {/* About last */}
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
