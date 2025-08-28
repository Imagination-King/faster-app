import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="(entry form)" />
      <Tabs.Screen name="share" />
    </Tabs>
  );
}
