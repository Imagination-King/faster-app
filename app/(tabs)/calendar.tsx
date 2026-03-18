import { CalendarDay } from "@/components/CalendarDay";
import { ActionButtons } from "@/components/EntryActionButtons";
import { EntryDetailView } from "@/components/EntryDetailView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useOrientation } from "../../hooks/useOrientation";
import { useSettings } from "../../hooks/useSettings";
import { formatDate } from "../../utils/dateFormatting";
import { ORDER } from "../constants/levels";
import { styles } from "../styles/calendarStyles";

type StoredEntry = {
  levels: string[];
  options: string[];
  createdAt: string;
};

// --- 1. LOCAL TIME FIX ---
const getLocalISODate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

// --- 3. COMPACT STYLING FIX ---
const CALENDAR_THEME = {
  "stylesheet.calendar.main": {
    week: {
      marginVertical: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      height: 60, // Restored your custom height
    },
  },
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CalendarHeader = ({ isToday, onJumpToday }: any) => (
  <View>
    <Text style={styles.headerText}>Select a Date</Text>
    <Pressable
      style={[styles.jumpButton, isToday && styles.jumpDisabled]}
      disabled={isToday}
      onPress={onJumpToday}
    >
      <Text
        style={[
          styles.buttonText,
          isToday && { color: "#007bff", fontStyle: "italic" },
        ]}
      >
        {isToday ? "Today is already selected" : "Jump to Today"}
      </Text>
    </Pressable>
  </View>
);

export default function CalendarPage() {
  const orientation = useOrientation();
  const { settings } = useSettings();
  const LEVEL_COLORS = settings.levelColors;
  const isLandscape = orientation === "landscape";

  const localToday = getLocalISODate();
  const [month, setMonth] = useState(localToday);
  const [selectedDate, setSelectedDate] = useState(localToday);
  const [entries, setEntries] = useState<Record<string, StoredEntry>>({});

  const currentEntry = entries[selectedDate];

  const getLowestLevel = (levels: string[]) => {
    for (let i = ORDER.length - 1; i >= 0; i--) {
      if (levels.includes(ORDER[i])) return ORDER[i];
    }
    return "";
  };

  const markedDates = useMemo(() => {
    const marks: any = {};
    Object.keys(entries).forEach((date) => {
      marks[date] = {
        hasEntry: true,
        letter: getLowestLevel(entries[date].levels),
      };
    });
    marks[selectedDate] = { ...marks[selectedDate], selected: true };
    return marks;
  }, [entries, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("entries").then((saved) => {
        if (saved) setEntries(JSON.parse(saved));
      });
    }, []),
  );

  const handleDateSelect = (dateString: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setSelectedDate(dateString);
    setMonth(dateString);
  };

  const handleEntryDelete = async () => {
    Alert.alert(
      "Delete Entry",
      `Are you sure you want to delete the entry for ${formatDate(selectedDate)}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            const updatedEntries = { ...entries };
            delete updatedEntries[selectedDate];
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setEntries(updatedEntries);
            await AsyncStorage.setItem(
              "entries",
              JSON.stringify(updatedEntries),
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={isLandscape ? styles.mainSplitView : styles.mainSingleView}>
        <View style={isLandscape ? styles.leftColumn : styles.fullWidth}>
          <CalendarHeader
            isToday={selectedDate === localToday}
            onJumpToday={() => handleDateSelect(localToday)}
          />

          <View style={styles.calendarCard}>
            <Calendar
              // --- 2. JUMP TO MONTH FIX ---
              // Using the month as part of the key forces the component to remount
              // and snap to the "current" prop when you jump to today.
              key={month.substring(0, 7)}
              current={month}
              onMonthChange={(date) => setMonth(date.dateString)}
              enableSwipeMonths
              theme={CALENDAR_THEME} // Applied theme here
              markedDates={markedDates}
              dayComponent={({ date, state, marking }) => (
                <CalendarDay
                  date={date}
                  state={state}
                  marking={marking}
                  colors={LEVEL_COLORS}
                  onSelect={handleDateSelect}
                />
              )}
            />
          </View>

          <ActionButtons
            selectedDate={selectedDate}
            hasEntry={!!currentEntry}
            onDelete={handleEntryDelete}
          />
        </View>

        <View style={isLandscape ? styles.rightColumn : styles.fullWidth}>
          <EntryDetailView
            entry={currentEntry}
            date={formatDate(selectedDate)}
            colors={LEVEL_COLORS}
          />
        </View>
      </View>
    </ScrollView>
  );
}
