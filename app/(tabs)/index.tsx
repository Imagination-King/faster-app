import { useOrientation } from "@/hooks/useOrientation";
import { useSettings } from "@/hooks/useSettings";
import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActionCard } from "../../components/ActionCard";

export default function Index() {
  const orientation = useOrientation();
  const { settings } = useSettings();
  const isLandscape = orientation === "landscape";

  const displayName = settings.userName || "Friend";

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.contentArea,
          { flexDirection: isLandscape ? "row" : "column" },
        ]}
      >
        {/* Text Section */}
        <View
          style={[
            styles.textBlock,
            isLandscape && { flex: 1, alignItems: "flex-start" },
          ]}
        >
          <Text style={styles.welcomeTitle}>Welcome, {displayName}!</Text>
          <Text style={styles.welcomeSubtitle}>
            You've just taken one step closer to true freedom. Let's explore
            your journey together.
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={[styles.buttonBlock, isLandscape && { flex: 1 }]}>
          <ActionCard
            title="What is this app?"
            subtitle="Learn how to use this app and about the FASTER Scale itself"
            onPress={() => router.push("/about")}
          />
          <ActionCard
            title="View Your Calendar"
            subtitle="Track your progress and fill out FASTER entries"
            onPress={() => router.push("/calendar")}
          />
          <ActionCard
            title="Share Your Progress"
            subtitle="Check in with your accountability partners"
            isSecondary
            onPress={() => router.push("/share")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff", // Using your brand blue as the background
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 20,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 10,
  },
  buttonBlock: {
    width: "100%",
    maxWidth: 400, // Keeps cards from getting too wide on tablets
  },
  disabledButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "#e6f0ff",
    textAlign: "center",
    marginTop: 8,
  },
});
