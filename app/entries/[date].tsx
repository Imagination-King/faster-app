import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useOrientation } from "../../hooks/useOrientation";
import { CheckboxGroup } from "./CheckboxGroup";

interface FormValues {
  checkboxGroup: string[];
}

type StoredEntry = {
  levels: string[];
  options: string[];
  createdAt: string;
};

function makeOption(label: string, level: string) {
  return {
    label,
    value: `${level}-${label}`,
    level,
  };
}

const levelOptions = [
  makeOption("No current secrets", "G"),
  makeOption("Working to solve problems", "G"),
  makeOption("Secrets", "F"),
  makeOption("Sarcasm", "F"),
  makeOption("Being Resentful", "A"),
  makeOption("Perfectionism", "A"),
  makeOption("Feeling Driven", "S"),
  makeOption("Irritable", "S"),
  makeOption("Increasing Sarcasm", "T"),
  makeOption("Feeling Alone", "T"),
  makeOption("Depressed", "E"),
  makeOption("Panicked", "E"),
  makeOption("Out of Control", "R"),
  makeOption("Giving Up and Giving In", "R"),
];

export default function EntryForm() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const orientation = useOrientation();
  const { control, handleSubmit, reset } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      checkboxGroup: [],
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const saved = await AsyncStorage.getItem("entries");
        const entries: Record<string, StoredEntry> = saved
          ? JSON.parse(saved)
          : {};
        const existingEntry = entries[date as string];
        if (existingEntry) {
          // Populate form with existing entry levels
          reset({ checkboxGroup: existingEntry.options });
        }
      } catch (error) {
        console.error("Error loading entry:", error);
      }
    }

    if (date) loadData();
  }, [date, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const selectedOptions = data.checkboxGroup;
    const shortendedLevels = selectedOptions.map((item) => item.charAt(0));
    const uniqueLevels = Array.from(new Set(shortendedLevels));
    const newEntry: StoredEntry = {
      levels: uniqueLevels,
      options: selectedOptions,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = await AsyncStorage.getItem("entries");
      const entries = saved
        ? (JSON.parse(saved) as Record<string, StoredEntry>)
        : {};
      entries[date as string] = newEntry;
      await AsyncStorage.setItem("entries", JSON.stringify(entries));
      router.replace("/calendar");
      console.log("Submitted:", data);
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        orientation === "landscape" && styles.landscapeContainer,
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.formTitle}>FASTER Scale</Text>

      <CheckboxGroup
        control={control}
        name="checkboxGroup"
        label="Pick at least 1"
        options={levelOptions}
        row
      />

      <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  landscapeContainer: {
    paddingHorizontal: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
});
