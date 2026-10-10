import { LEVEL_LABELS, ORDER } from "@/app/constants/levels";
import { styles } from "@/app/styles/calendarStyles";
import { StoredEntry } from "../types/entry";
import { ScrollView, Text, View } from "react-native";

export const EntryDetailView = ({
  entry,
  date,
  colors,
}: {
  entry?: StoredEntry;
  date: string;
  colors: Record<string, string>;
}) => {
  if (!entry) {
    return (
      <View style={styles.emptyEntry}>
        <Text style={styles.emptyEntryText}>No entry for this date yet.</Text>
      </View>
    );
  }

  const grouped = entry.options.reduce<Record<string, string[]>>(
    (acc, option) => {
      const separatorIndex = option.indexOf("-");
      if (separatorIndex < 0) return acc;

      const level = option.slice(0, separatorIndex);
      const label = option.slice(separatorIndex + 1);
      if (!acc[level]) acc[level] = [];
      acc[level].push(label);
      return acc;
    },
    {},
  );

  const getOptionLabel = (option: string) => {
    const separatorIndex = option.indexOf("-");
    return separatorIndex < 0 ? option : option.slice(separatorIndex + 1);
  };

  const hasAnswers = (answers: string[] | undefined) =>
    answers?.some((answer) => answer.trim().length > 0) ?? false;

  return (
    <ScrollView style={styles.entryDetailsBox}>
      <Text style={styles.entryTitle}>Details for {date}</Text>

      {ORDER.map((level) => {
        const options = grouped[level] ?? [];
        const response = entry.responses?.[level];
        const reflectionOptions = response?.selectedOptions ?? [];
        const showResponse =
          reflectionOptions.length > 0 || hasAnswers(response?.answers);

        if (options.length === 0 && !showResponse) return null;

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
            {options.map((option, index) => (
              <Text key={index} style={styles.bulletText}>
                • {option}
              </Text>
            ))}
            {showResponse && response && (
              <View style={{ marginTop: 8 }}>
                {reflectionOptions.length > 0 && (
                  <>
                    <Text style={[styles.bulletText, { fontWeight: "600" }]}>
                      Options to reflect on
                    </Text>
                    {reflectionOptions.map((option, index) => (
                      <Text key={index} style={styles.bulletText}>
                        • {getOptionLabel(option)}
                      </Text>
                    ))}
                  </>
                )}
                {response.answers.map((answer, index) =>
                  answer.trim() ? (
                    <View key={index} style={{ marginTop: 6 }}>
                      <Text style={[styles.bulletText, { fontWeight: "600" }]}>
                        Question {index + 1}
                      </Text>
                      <Text style={styles.bulletText}>{answer}</Text>
                    </View>
                  ) : null,
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};
