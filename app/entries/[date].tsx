import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function DatedEntry() {
  const { date } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>This is a blank entry</Text>
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
