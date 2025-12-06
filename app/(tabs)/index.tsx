import { useOrientation } from "@/hooks/useOrientation";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const orientation = useOrientation();
  return (
    <View
      style={[
        styles.container,
        { flexDirection: orientation === "landscape" ? "row" : "column" },
      ]}
    >
      <Text>Welcome to the FASTER App! This is the home screen.</Text>
      <Link href="/calendar">View Calendar</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
