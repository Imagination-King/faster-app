import { styles } from "@/app/styles/calendarStyles";
import { Pressable, Text, View } from "react-native";

export const CalendarDay = ({
  date,
  state,
  marking,
  colors,
  onSelect,
}: any) => {
  if (!date) return null;

  const isSelected = marking?.selected;
  const letter = marking?.letter || "";
  const isExtraDay = state === "disabled";
  const badgeColor = letter ? colors[letter] : "transparent";

  return (
    <Pressable
      onPress={() => onSelect(date.dateString)}
      style={[styles.dayContainer, isSelected && styles.selectedDate]}
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
};
