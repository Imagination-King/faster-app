import { styles } from "@/app/styles/calendarStyles";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export const ActionButtons = ({ selectedDate, hasEntry, onDelete }: any) => {
  const navigateToEntry = () => {
    router.push({
      pathname: "../entries/[date]",
      params: { date: selectedDate },
    });
  };

  return (
    <View style={styles.buttonRow}>
      {!hasEntry ? (
        <Pressable onPress={navigateToEntry} style={styles.newEntryButton}>
          <Text style={styles.buttonText}>New Entry</Text>
        </Pressable>
      ) : (
        <>
          <Pressable onPress={navigateToEntry} style={styles.editEntryButton}>
            <Text style={styles.buttonText}>Edit Entry</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.deleteEntryButton}>
            <Text style={styles.buttonText}>Delete Entry</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};
