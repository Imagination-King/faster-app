import { LEVEL_LABELS, ORDER } from "@/app/constants/levels";
import { styles } from "@/app/styles/calendarStyles";
import { ScrollView, Text, View } from "react-native";

export const EntryDetailView = ({ entry, date, colors }: any) => {
  if (!entry) {
    return (
      <View style={styles.emptyEntry}>
        <Text style={styles.emptyEntryText}>No entry for this date yet.</Text>
      </View>
    );
  }

  // Helper to group "Level-Label" strings into { Level: [Labels] }
  const grouped = entry.options.reduce((acc: any, option: string) => {
    const [level, label] = option.split("-");
    if (!acc[level]) acc[level] = [];
    acc[level].push(label);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.entryDetailsBox}>
      <Text style={styles.entryTitle}>Details for {date}</Text>

      {ORDER.map((level) => {
        const options = grouped[level];
        if (!options) return null;

        return (
          <View key={level} style={{ marginVertical: 8 }}>
            <Text
              style={[
                styles.bulletText,
                { fontWeight: "bold", color: colors[level] },
              ]}
            >
              {LEVEL_LABELS[level]}
            </Text>
            {options.map((opt: string, i: number) => (
              <Text key={i} style={styles.bulletText}>
                • {opt}
              </Text>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};
