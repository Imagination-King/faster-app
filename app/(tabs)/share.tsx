import { StyleSheet, Text, View } from "react-native";
import { useOrientation } from "../../hooks/useOrientation";

export default function Calendar() {
  const orientation = useOrientation();
  return (
    <View
      style={[
        styles.container,
        { flexDirection: orientation === "landscape" ? "row" : "column" },
      ]}
    >
      <Text>This is where the share feature goes</Text>
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
