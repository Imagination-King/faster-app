import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useOrientation } from "../../hooks/useOrientation";

// prettier-ignore
const MONTHS = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];

const order = ["G", "F", "A", "S", "T", "E", "R"];
function lowestLetter(levels: string[]) {
  // prettier-ignore
  if(__DEV__) { console.log("LowestLetter called with: ", levels); }

  for (let i = order.length - 1; i >= 0; i--) {
    if (levels.includes(order[i])) return order[i]; // go through the array from lowest to highest, finding first match
  }
  return "";
}

function groupOptionsByLevel(options: string[]) {
  const grouped: Record<string, string[]> = {};
  for (const o of options) {
    const [level, label] = o.split("-");
    if (!grouped[level]) {
      grouped[level] = [];
    }
    grouped[level].push(label);
  }
  return grouped;
}

type StoredEntry = {
  levels: string[];
  options: string[];
  createdAt: string;
};

export default function CalendarPage() {
  const today = new Date(); //Set default day to today (local time)
  const orientation = useOrientation(); // for layout adjustments

  // Enable LayoutAnimation on Android, animate orientation changes
  useEffect(() => {
    if(Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental){
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Animate layout changes when orientation changes
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [orientation]);

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

  // convert date from YYYY-MM-DD to MMM DD, YYYY
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.headerText}>Select a Date</Text>
      <View
        style={
          orientation === "landscape"
            ? styles.landscapeContent
            : styles.portraitContent
        }
      >
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
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDateText,
                  ]}
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
      </View>
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
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            Complete Scale:
          </Text>

          {(() => {
            const grouped = groupOptionsByLevel(currentEntry.options);
            return order.map((level) => {
              const optionsForLevel = grouped[level] || [];
              if (optionsForLevel.length === 0) return null;

              return (
                <View key={level} style={{ marginVertical: 6 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {prettyLabel(level)}
                  </Text>
                  {optionsForLevel.map((opt, idx) => (
                    <Text key={idx} style={{ marginLeft: 12 }}>
                      • {opt}
                    </Text>
                  ))}
                </View>
              );
            });
          })()}
        </View>
      ) : (
        <Text>No entry for this date yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
  },
  contentContainer: {
    alignItems: "stretch",
    paddingBottom: 20,
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
  portraitContent: {
    width: "100%",
    maxHeight: "70%",
  },
  landscapeContent: {
    width: "100%",
    maxHeight: "70%",
  },
});
