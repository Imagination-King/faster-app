import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

// prettier-ignore
const MONTHS = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];

const order = ["R", "E", "T", "S", "A", "F", "G"]; // lowest to highest
function lowestLetter(levels: string[]) {
  // prettier-ignore
  if(__DEV__) { console.log("LowestLetter called with: ", levels); }

  for (const letter of order) {
    if (levels.includes(letter)) return letter;
  }
  return "";
}

type StoredEntry = {
  levels: string[];
  createdAt: string;
};

export default function CalendarPage() {
  //Setting default day to today (local time)
  const today = new Date();

  const localToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(localToday);
  const [entries, setEntries] = useState<Record<string, StoredEntry>>({});

  // Load entries from AsyncStorage when the screen first mounts
  useFocusEffect(
    useCallback(() => {
      async function loadEntries() {
        try {
          const saved = await AsyncStorage.getItem("entries");
          const parsed = saved ? JSON.parse(saved) : {};

          // prettier-ignore
          if(__DEV__) { console.log("Loaded entries:", parsed); }

          setEntries(parsed);
        } catch (err) {
          console.error("Error loading entries:", err);
        }
      }

      loadEntries();
    }, [])
  );

  // pull entry for current date
  const currentEntry = entries[selectedDate];

  // convert date from YYYY-MM-DD to something more readable
  function formatDate(
    input: string | { year: number; month: number; day: number }
  ) {
    let year, month, day;

    if (typeof input === "string") {
      // parse "YYYY-MM-DD"
      const parts = input.split("-");
      if (parts.length !== 3) return input; // fallback
      year = Number(parts[0]);
      month = Number(parts[1]);
      day = Number(parts[2]);
    } else if (input && typeof input === "object") {
      ({ year, month, day } = input);
    } else {
      return "";
    }

    return `${MONTHS[month - 1]} ${String(day).padStart(2, "0")}, ${year}`;
  }

  // Convert values from saved entry back to normal text
  function prettyLabel(level: string) {
    const map: Record<string, string> = {
      G: "Restoration",
      F: "Forgetting Priorities",
      A: "Anxiety",
      S: "Speeding Up",
      T: "Ticked Off",
      E: "Exhausted",
      R: "Relapse",
    };
    return map[level] || level;
  }

  // prettier-ignore
  if (__DEV__){ console.log("Current entry for", selectedDate, currentEntry);}

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select a Date</Text>
      <Calendar
        style={styles.calendar}
        hideExtraDays={true}
        // overide default styles from Calendar
        theme={{
          "stylesheet.calendar.main": {
            week: {
              marginVertical: 0,
              flexDirection: "row",
              justifyContent: "space-around",
              height: 60,
            },
          },
        }}
        dayComponent={({ date }) => {
          if (!date) return null;
          const isSelected = date.dateString === selectedDate;
          const entry = entries[date.dateString];
          // grab first letter of entry
          const letter = entry ? lowestLetter(entry.levels) : "";
          // prettier-ignore
          if (__DEV__) { console.log("Day:",date.dateString,"Letter:",letter,"Levels:",entry?.levels); }

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
                {letter}
              </Text>
            </Pressable>
          );
        }}
      />
      <Text style={styles.headerText}>{formatDate(selectedDate)}</Text>
      <View style={styles.buttonRow}>
        {!currentEntry ? (
          // Show New if no entry exists
          <Pressable
            onPress={() =>
              router.push({
                pathname: "../entries/[date]",
                params: { date: selectedDate },
              })
            }
            style={[styles.newEntryButton]}
          >
            <Text style={styles.buttonText}>New Entry</Text>
          </Pressable>
        ) : (
          // Show Edit and Delete if entry exists
          <>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "../entries/[date]",
                  params: { date: selectedDate },
                })
              }
              style={[styles.editEntryButton]}
            >
              <Text style={styles.buttonText}>Edit Entry</Text>
            </Pressable>
            <Pressable
              style={[styles.deleteEntryButton]}
              onPress={async () => {
                const updated = { ...entries };
                delete updated[selectedDate];
                setEntries(updated);
                await AsyncStorage.setItem("entries", JSON.stringify(updated));
              }}
            >
              <Text style={styles.buttonText}>Delete Entry</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Display entry details if present */}
      {currentEntry ? (
        <View>
          <Text>Entry for {formatDate(selectedDate)}</Text>
          <Text>
            Lowest Level: {prettyLabel(lowestLetter(currentEntry.levels))}
          </Text>
          <Text>
            Complete Scale: {currentEntry.levels.map(prettyLabel).join(", ")}
          </Text>
        </View>
      ) : (
        <Text>No entry for this date yet.</Text>
      )}
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
  newEntryButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  editEntryButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  deleteEntryButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
