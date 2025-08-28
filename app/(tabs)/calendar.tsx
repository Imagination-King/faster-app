import { StyleSheet, Text, View } from "react-native";

export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text>This is where the calendar goes</Text>
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