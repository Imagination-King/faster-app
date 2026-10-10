import { formatDate } from "@/utils/dateFormatting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { levelOptions } from "../../data/levelOptions";
import { useOrientation } from "../../hooks/useOrientation";
import { useSettings } from "../../hooks/useSettings";
import {
  createEmptyLevelResponses,
  EntryFormValues,
  StoredEntry,
} from "../../types/entry";
import { LEVEL_LABELS, ORDER } from "../constants/levels";
import { styles } from "./formStyles";

export default function EntryForm() {
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const { settings, isLoading: areSettingsLoading } = useSettings();
  const { control, handleSubmit, reset } = useForm<EntryFormValues>({
    mode: "all",
    defaultValues: {
      checkboxGroup: [],
      levelResponses: createEmptyLevelResponses(),
    },
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [isEntryLoading, setIsEntryLoading] = useState(true);
  const selectedOptions = useWatch({ control, name: "checkboxGroup" }) ?? [];
  const formLayout = settings.formLayout;
  const pageCount =
    formLayout === "level-pages"
      ? ORDER.length
      : formLayout === "questions-page"
        ? 2
        : 1;
  const currentLevel =
    formLayout === "level-pages" ? ORDER[pageIndex] : undefined;
  const getPageLabel = (index: number) =>
    formLayout === "questions-page"
      ? index === 0
        ? "Checkboxes"
        : "Questions"
      : LEVEL_LABELS[ORDER[index]] ?? "Level";

  useEffect(() => {
    setPageIndex(0);
  }, [formLayout]);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      setIsEntryLoading(true);
      try {
        if (!date) return;

        const saved = await AsyncStorage.getItem("entries");
        const entries: Record<string, StoredEntry> = saved
          ? JSON.parse(saved)
          : {};
        const existingEntry = entries[date as string];
        if (existingEntry) {
          // Populate form with existing entry levels
          reset({
            checkboxGroup: existingEntry.options,
            levelResponses: {
              ...createEmptyLevelResponses(),
              ...existingEntry.responses,
            },
          });
        }
      } catch (error) {
        console.error("Error loading entry:", error);
      } finally {
        if (isCurrent) setIsEntryLoading(false);
      }
    }

    loadData();

    return () => {
      isCurrent = false;
    };
  }, [date, reset]);

  // Save data to AsyncStorage on form submission
  const onSubmit: SubmitHandler<EntryFormValues> = async (data) => {
    const selectedOptions = data.checkboxGroup;
    const shortendedLevels = selectedOptions.map((item) => item.charAt(0));
    const uniqueLevels = Array.from(new Set(shortendedLevels));
    const responses = Object.fromEntries(
      Object.entries(data.levelResponses).map(([level, response]) => [
        level,
        (() => {
          const selectedOption = response.selectedOptions.find((option) =>
            selectedOptions.includes(option),
          );
          return {
            selectedOptions: selectedOption ? [selectedOption] : [],
            answers: selectedOption
              ? response.answers
              : (["", "", ""] as [string, string, string]),
          };
        })(),
      ]),
    );
    const newEntry: StoredEntry = {
      levels: uniqueLevels,
      options: selectedOptions,
      responses,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = await AsyncStorage.getItem("entries");
      const entries = saved
        ? (JSON.parse(saved) as Record<string, StoredEntry>)
        : {};
      entries[date as string] = newEntry;
      await AsyncStorage.setItem("entries", JSON.stringify(entries));
      console.log("Submitted:", data);
      router.back();
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  // this could be done inside useLayoutEffect but this way prevents unnecessary re-renders
  const submitButton = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const renderLevelQuestions = (level: string) => (
    <LevelQuestions
      key={level}
      control={control}
      level={level}
      checkedOptions={levelOptions.filter(
        (option) =>
          option.level === level && selectedOptions.includes(option.value),
      )}
    />
  );

  // Header configuration with dynamic title and save button
  useLayoutEffect(() => {
    navigation.setOptions({
      title: date ? `Edit Entry - ${formatDate(date as string)}` : "New Entry",
      headerRight: () => (
        <Pressable
          onPress={submitButton}
          disabled={areSettingsLoading || isEntryLoading}
          style={{ paddingHorizontal: 12 }}
        >
          <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
            Save
          </Text>
        </Pressable>
      ),
    });
  }, [areSettingsLoading, date, isEntryLoading, navigation, submitButton]);

  if (areSettingsLoading || isEntryLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading entry...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        key={`${formLayout}-${pageIndex}`}
        style={[
          styles.container,
          orientation === "landscape" && styles.landscapeContainer,
        ]}
        contentContainerStyle={[
          styles.contentContainer,
          { flexGrow: 1, paddingBottom: 150 + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.formTitle}>FASTER Scale</Text>

        {formLayout === "single-page" && (
          <CheckboxGroup
            control={control}
            name="checkboxGroup"
            label="Pick at least 1"
            options={levelOptions}
            row
            renderSectionFooter={renderLevelQuestions}
          />
        )}

        {formLayout === "questions-page" &&
          (pageIndex === 0 ? (
            <CheckboxGroup
              control={control}
              name="checkboxGroup"
              label="Pick at least 1"
              options={levelOptions}
              row
            />
          ) : (
            <View>
              <Text style={styles.pageTitle}>Questions for each level</Text>
              {ORDER.map((level) => (
                <View key={level} style={styles.questionsPageSection}>
                  <Text
                    style={[
                      styles.questionsPageLevel,
                      { color: settings.levelColors[level] },
                    ]}
                  >
                    {LEVEL_LABELS[level]}
                  </Text>
                  {renderLevelQuestions(level)}
                </View>
              ))}
            </View>
          ))}

        {formLayout === "level-pages" && currentLevel && (
          <CheckboxGroup
            control={control}
            name="checkboxGroup"
            label="Pick at least 1"
            options={levelOptions.filter(
              (option) => option.level === currentLevel,
            )}
            row
            renderSectionFooter={renderLevelQuestions}
          />
        )}

      </ScrollView>

      <View
        style={[
          styles.floatingNavigation,
          { bottom: Math.max(insets.bottom, 8) + 8 },
        ]}
      >
        {pageCount > 1 && (
          <Text style={styles.pageIndicator}>
            {formLayout === "level-pages"
              ? `${LEVEL_LABELS[currentLevel ?? ""]} (${pageIndex + 1} of ${pageCount})`
              : getPageLabel(pageIndex)}
          </Text>
        )}
        <View style={styles.pageNavigation}>
          {pageCount > 1 ? (
            <Pressable
              disabled={pageIndex === 0}
              onPress={() => setPageIndex((index) => index - 1)}
              style={[
                styles.pageButton,
                pageIndex === 0 && styles.disabledPageButton,
              ]}
            >
              <Text style={styles.pageButtonText} numberOfLines={2}>
                {pageIndex === 0
                  ? "Previous"
                  : `← ${getPageLabel(pageIndex - 1)}`}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.pageButtonSpacer} />
          )}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={[styles.pageButton, styles.savePageButton]}
          >
            <Text style={styles.pageButtonText}>Save</Text>
          </Pressable>
          {pageCount > 1 ? (
            <Pressable
              disabled={pageIndex === pageCount - 1}
              onPress={() => setPageIndex((index) => index + 1)}
              style={[
                styles.pageButton,
                pageIndex === pageCount - 1 && styles.disabledPageButton,
              ]}
            >
              <Text style={styles.pageButtonText} numberOfLines={2}>
                {pageIndex === pageCount - 1
                  ? "Last page"
                  : `${getPageLabel(pageIndex + 1)} →`}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.pageButtonSpacer} />
          )}
        </View>
      </View>
    </View>
  );
}

function LevelQuestions({
  control,
  level,
  checkedOptions,
}: {
  control: ReturnType<typeof useForm<EntryFormValues>>["control"];
  level: string;
  checkedOptions: (typeof levelOptions)[number][];
}) {
  const selectedOptions = useWatch({
    control,
    name: `levelResponses.${level}.selectedOptions`,
  });
  const selectedOption =
    Array.isArray(selectedOptions) &&
    selectedOptions.some((value) =>
      checkedOptions.some((option) => option.value === value),
    );

  return (
    // Most Powerful Behavior prompt don't appear until any behavior is checked
    <View style={styles.questions}>
      {checkedOptions.length === 0 ? (
        <Text style={styles.noOptions}>
          Option unavailable - No behaviors selected
        </Text>
      ) : (
        <>
          <Text style={styles.questionLabel}>Most Powerful Behavior</Text>
          <Controller
            control={control}
            name={`levelResponses.${level}.selectedOptions`}
            render={({ field }) => {
              const selectedOption = Array.isArray(field.value)
                ? field.value.find((value) =>
                  checkedOptions.some((option) => option.value === value),
                ) ?? ""
                : "";

              // Selected behaviors from current level appear in Picker
              return (
                <Picker
                  selectedValue={selectedOption}
                  mode="dropdown"
                  onValueChange={(value: string) =>
                    field.onChange(value ? [value] : [])
                  }
                  style={styles.selector}
                >
                  <Picker.Item label="Choose a behavior..." value="" />
                  {checkedOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              );
            }}
          />
        </>
      )}

      {/* Digging Deeper Questions don't appear until a behavior is selected */}
      {checkedOptions.length > 0 && !selectedOption ? (
        <Text style={styles.noOptions}>
          Care to dig deeper? Choose one behavior listed above that resonates with you the most, and answer the questions that appear here.
        </Text>
      ) : checkedOptions.length > 0 ?
        <Text style={styles.noOptions}>
          Answer the following questions about the behavior you selected:
        </Text> : null
      }

      {selectedOption &&
        ([0, 1, 2] as const).map((answerIndex) => (
          <View key={answerIndex} style={styles.answerField}>
            <Text style={styles.questionLabel}>
              {answerIndex === 0
                ? "1: How does this affect you? How does it make you feel in the moment?"
                : answerIndex === 1
                  ? "2: How does this affect the important people in your life?"
                  : "3: Why do you do this? How does it benefit you?"}
            </Text>
            <Controller
              control={control}
              name={`levelResponses.${level}.answers.${answerIndex}`}
              render={({ field }) => (
                <GrowingTextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </View>
        ))}
    </View>
  );
}

function GrowingTextInput({
  value,
  onChangeText,
  onBlur,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
}) {
  const [height, setHeight] = useState(60);

  return (
    <TextInput
      multiline
      numberOfLines={2}
      scrollEnabled={false}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      onContentSizeChange={(event) =>
        setHeight(Math.max(60, event.nativeEvent.contentSize.height))
      }
      placeholder="Short answer"
      style={[styles.answerInput, { height }]}
    />
  );
}
