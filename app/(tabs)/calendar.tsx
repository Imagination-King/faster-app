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
    "2025-09-02": "R",
    "2025-08-01": "F",
    "2025-08-14": "S",
    "2025-08-21": "T",
    "2025-08-28": "E",
    "2025-08-30": "R",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select a Date</Text>
      <Calendar
        style={styles.calendar}
        hideExtraDays={true}
        theme={{
          "stylesheet.calendar.main": {
            week: {
              marginVertical: 0, // remove vertical padding
              flexDirection: "row",
              justifyContent: "space-around",
              height: 60, // tweak this value until it matches your cells
            },
          },
        }}
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const isSelected = date.dateString === selectedDate;
          return (
            <Pressable
              onPress={() => setSelectedDate(date.dateString)}
              style={[styles.dayContainer, isSelected && styles.selectedDate]}
            >
              <Text
                style={[styles.dayText, isSelected && styles.selectedDateText]}
              >
                {date.day}
              </Text>

              <Text
                style={[
                  styles.symbolText,
                  isSelected && styles.selectedSymbolText,
                ]}
              >
                {fasterScale[date.dateString] || ""}
              </Text>
            </Pressable>
          );
        }}
      />
      <Text style={styles.headerText}>{selectedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignItems: "stretch",
    alignSelf: "center",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    padding: 10,
  },
  calendar: {
    width: "100%",
  },
  dayContainer: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "gray",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  symbolText: {
    fontSize: 12,
    color: "#3b82f6", // blue placeholder, adjust later
    marginTop: 2,
  },
  selectedDate: {
    backgroundColor: "#77aafdff",
    borderRadius: 8,
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedSymbolText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
