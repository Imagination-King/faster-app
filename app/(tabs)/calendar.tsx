import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { useOrientation } from "../../hooks/useOrientation";
import { formatDate } from "../../utils/dateFormatting";

interface CalendarMarkingProps extends MarkingProps {
  letter?: string;
  hasEntry?: boolean;
}

// prettier-ignore
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CALENDAR_THEME = {
  "stylesheet.calendar.main": {
    week: {
      marginVertical: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      height: 60,
    },
  },
};

const ORDER = ["G", "F", "A", "S", "T", "E", "R"];
const LEVEL_COLORS: Record<string, string> = {
  // placeholder colors, will adjust later for better palette
  G: "#6FCF97",
  F: "#F6A623",
  A: "#F63B3B",
  S: "#50E3C2",
  T: "#B388FF",
  E: "#F8E71C",
  R: "#FF6B6B",
};

function getLowestLetter(levels: string[]) {
  // prettier-ignore
  if(__DEV__) { console.log("LowestLetter called with: ", levels); }
  for (let i = ORDER.length - 1; i >= 0; i--) {
    if (levels.includes(ORDER[i])) return ORDER[i];
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
  const orientation = useOrientation(); // for layout adjustments
  const isLandscape = orientation === "landscape";
  const localToday = new Date().toISOString().split("T")[0]; //Set default day to today (local time)
  const [month, setMonth] = useState(localToday); // tracks currently displayed
  const [selectedDate, setSelectedDate] = useState(localToday); // current day being viewed/edited
  const [entries, setEntries] = useState<Record<string, StoredEntry>>({}); // all entries, keyed by date
  const currentEntry = entries[selectedDate]; // entry for current selected date
  const isTodaySelected = selectedDate === localToday; // is Today currently selected?

  // Animate layout changes when orientation changes
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [orientation]);

  // Memoize dates with entries to avoid unnecessary re-renders
  const markedDates = useMemo(() => {
    const marks: any = {};

    // Mark all dates with entries, include lowest level indicator
    Object.keys(entries).forEach((date) => {
      marks[date] = {
        hasEntry: true,
        letter: getLowestLetter(entries[date].levels),
      };
    });

    // Ensure the selected date always has the 'selected' flag
    marks[selectedDate] = { ...marks[selectedDate], selected: true };
    return marks;
  }, [entries, selectedDate]);

  // Load entries from AsyncStorage when the screen first mounts
  useFocusEffect(
    useCallback(() => {
      async function loadEntries() {
        const saved = await AsyncStorage.getItem("entries");
        if (saved) setEntries(JSON.parse(saved));
      }
      loadEntries();
    }, []),
  );

  // Used when clicking dates outside of current month, and "Jump to today" button
  const handleDateSelect = (dateString: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setSelectedDate(dateString);
    setMonth(dateString);
  };
  const handleMonthChange = (dateString: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMonth(dateString);
  };

  const handleEntryDelete = async () => {
    Alert.alert(
      "Delete Entry",
      `Are you sure you want to delete the entry for ${formatDate(selectedDate)}? This cannot be undone.`,
      [
        { text: "No, Nevermind", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            const updatedEntries = { ...entries };
            delete updatedEntries[selectedDate];
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setEntries(updatedEntries);
            // prettier-ignore
            await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
          },
        },
      ],
    );
  };

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
      <View style={isLandscape ? styles.mainSplitView : styles.mainSingleView}>
        {/*Left Column: Calendar and Buttons*/}
        <View style={isLandscape ? styles.leftColumn : styles.fullWidth}>
          <Text style={styles.headerText}>Select a Date</Text>
          <Pressable
            style={[styles.jumpButton, isTodaySelected && styles.jumpDisabled]}
            disabled={isTodaySelected}
            onPress={() => handleDateSelect(localToday)}
          >
            <Text
              style={[
                styles.buttonText,
                isTodaySelected && { color: "#007bff", fontStyle: "italic" },
              ]}
            >
              {isTodaySelected ? "Today is already selected" : "Jump to Today"}
            </Text>
          </Pressable>
          <View style={styles.calendarCard}>
            <Calendar
              key={month.substring(0, 7)}
              current={month}
              onMonthChange={(date) => handleMonthChange(date.dateString)}
              enableSwipeMonths={true}
              // overide default styles from Calendar
              theme={CALENDAR_THEME}
              markedDates={markedDates}
              dayComponent={({ date, state, marking }) => {
                const calendarMarking = (marking as CalendarMarkingProps) || {}; // making TypeScript happy with custom props
                if (!date) return null;
                const isSelected = calendarMarking.selected;
                const letter = calendarMarking.letter || ""; // grab first letter of entry
                const badgeColor = letter ? LEVEL_COLORS[letter] : undefined; // badge color based on LEVEL_COLORS
                const isExtraDay = state === "disabled";

                return (
                  <Pressable
                    onPress={() => handleDateSelect(date.dateString)}
                    style={[
                      styles.dayContainer,
                      isSelected && styles.selectedDate,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDateText,
                        isExtraDay && styles.extraDayText,
                      ]}
                    >
                      {date.day}
                    </Text>

                    {letter && (
                      <View
                        style={[
                          styles.symbolBadge,
                          isExtraDay
                            ? styles.extraSymbolBadge
                            : { backgroundColor: badgeColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.symbolText,
                            isSelected && styles.selectedSymbolText,
                            isExtraDay && styles.extraSymbolText,
                          ]}
                        >
                          {letter}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              }}
            />
          </View>

          {/*Footer with entry details and actions*/}
          <Text style={styles.headerText}>{formatDate(selectedDate)}</Text>
          <View style={styles.buttonRow}>
            {!currentEntry ? ( // "New Entry" button if no entry exists for this date, otherwise show Edit/Delete buttons
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
                  onPress={handleEntryDelete}
                >
                  <Text style={styles.buttonText}>Delete Entry</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Display entry details if present */}
        <View
          style={
            orientation === "landscape" ? styles.rightColumn : styles.fullWidth
          }
        >
          {currentEntry ? (
            <ScrollView
              style={{
                maxHeight: orientation === "landscape" ? 500 : undefined,
              }}
            >
              <View key={selectedDate} style={styles.entryDetailsBox}>
                <Text style={styles.entryTitle}>
                  Entry for {formatDate(selectedDate)}
                </Text>
                <Text style={styles.entryHeader}>
                  Lowest Level:{" "}
                  <Text
                    style={{
                      color: LEVEL_COLORS[getLowestLetter(currentEntry.levels)],
                      fontWeight: "900",
                    }}
                  >
                    {prettyLabel(getLowestLetter(currentEntry.levels))}
                  </Text>
                </Text>
                <Text style={styles.entryHeader}>Complete Scale:</Text>
                {/* Group options by level and display with colored headers */}
                {(() => {
                  const grouped = groupOptionsByLevel(currentEntry.options);
                  return ORDER.map((level) => {
                    const optionsForLevel = grouped[level] || [];
                    if (optionsForLevel.length === 0) return null;

                    return (
                      <View key={level} style={{ marginVertical: 6 }}>
                        <Text
                          style={[
                            styles.bulletText,
                            { fontWeight: "bold", color: LEVEL_COLORS[level] },
                          ]}
                        >
                          {prettyLabel(level)}
                        </Text>
                        {optionsForLevel.map((opt, idx) => (
                          <Text key={idx} style={styles.bulletText}>
                            • {opt}
                          </Text>
                        ))}
                      </View>
                    );
                  });
                })()}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyEntry}>
              <Text style={styles.emptyEntryText}>
                No entry for this date yet.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainSplitView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  mainSingleView: { flexDirection: "column" },
  leftColumn: { flex: 0.9, paddingRight: 5 },
  rightColumn: { flex: 5, paddingLeft: 5 },
  fullWidth: { width: "100%" },
  container: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginVertical: 15,
    // Matching the entry details shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
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
    paddingBottom: 5,
  },
  dayContainer: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: "gray",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
    marginBottom: -1,
  },
  symbolText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: -1,
    marginRight: -1,
  },
  symbolBadge: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  emptyBadge: {
    width: 25,
    height: 25,
    marginTop: 2,
  },
  // I don't know what I want to do with these yet

  // selectedSymbolBadge: {
  //   backgroundColor: "#2b6ef6",
  // },

  extraSymbolBadge: {
    backgroundColor: "#e0e0e0",
  },
  selectedDate: {
    backgroundColor: "#77aafdff",
    borderRadius: 12,
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  extraDayText: {
    color: "#bdbdbd",
  },
  extraSymbolText: {
    color: "#9e9e9e",
  },
  jumpButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  jumpDisabled: {
    opacity: 0.5,
    backgroundColor: "#9ecaf8",
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
    fontWeight: "600",
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

  // The main wrapper for the entry details
  entryDetailsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 4, // Prevents shadows from clipping
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android Shadow
    elevation: 5,
  },
  // The date header inside the card
  entryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 8,
  },
  // Sub-headers for "Lowest Level" and "Complete Scale"
  entryHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  // The "No entry" placeholder
  emptyEntry: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyEntryText: {
    color: "#999",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  // Bullet point container
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
    paddingLeft: 8,
  },
  bulletText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
