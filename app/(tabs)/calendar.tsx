import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarPage() {
  //Setting default day to today (local time)
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(localToday);

  const fasterScale = {
    "2025-08-02": "R",
    "2025-08-01": "F",
    // "2025-08-07": "A",
    "2025-08-14": "S",
    "2025-08-21": "T",
    "2025-08-28": "E",
    "2025-08-30": "R",
  };

  return (
    <View style={styles.container}>
      <Text>Select a Date</Text>
      <Calendar
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const isSelected = date.dateString === selectedDate;
          return (
            <Pressable
              onPress={() => setSelectedDate(date.dateString)}
              style={[styles.dayContainer, isSelected && styles.selectedDate]}
            >
              <View style={styles.days}>
                <Text
                  style={[
                    styles.dayText,
                    state === "disabled" && styles.disabledText,
                    isSelected && styles.selectedDateText,
                  ]}
                >
                  {date.day}
                </Text>

                <Text style={styles.symbolText}>
                  {fasterScale[date.dateString] || ""}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 40,
  },
  days: {
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  disabledText: {
    color: "gray",
  },
  symbolText: {
    fontSize: 12,
    color: "#3b82f6", // blue placeholder, adjust later
    marginTop: 2,
  },
  selectedDate: {
    backgroundColor: "#77aafdff",
    borderRadius: 5,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
});
