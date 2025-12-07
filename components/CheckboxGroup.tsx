import { Checkbox } from "expo-checkbox";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LevelOption } from "../data/levelOptions";
import { useOrientation } from "../hooks/useOrientation";

interface CheckboxGroupProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: LevelOption[];
  row?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  control,
  name,
  label,
  options,
  row,
}) => {
  const orientation = useOrientation();
  const shouldUseRow = row && orientation !== "landscape";

  // Convert values from saved entry back to normal text
  const order = ["G", "F", "A", "S", "T", "E", "R"];
  const prettyLabel: Record<string, string> = {
    G: "Restoration",
    F: "Forgetting Priorities",
    A: "Anxiety",
    S: "Speeding Up",
    T: "Ticked Off",
    E: "Exhausted",
    R: "Relapse",
  };

  // group options by level inferred from value[0]
  const grouped: Record<string, LevelOption[]> = {};
  options.forEach((opt) => {
    const lvl = opt.value.charAt(0) || "OTHER";
    if (!grouped[lvl]) grouped[lvl] = [];
    grouped[lvl].push(opt);
  });

  // build ordered sections for rendering
  const sections = order
    .filter((lvl) => grouped[lvl] && grouped[lvl].length > 0)
    .map((lvl) => ({ key: lvl, title: prettyLabel[lvl] ?? lvl, data: grouped[lvl] }));

  // Dynamically choose columns based on available screen width.
  const { width: windowWidth } = useWindowDimensions();

  const CONTAINER_SIDE_PADDING = 16; // should match parent horizontal padding
  const ITEM_GUTTER = 12; // horizontal space between items
  const MIN_ITEM_WIDTH = 200; // smallest acceptable item width; tune as needed

  const availableWidth = Math.max(0, windowWidth - CONTAINER_SIDE_PADDING * 2);

  // estimate max columns that could fit given MIN_ITEM_WIDTH, then pick the largest
  // columns value (c) such that computed item width >= MIN_ITEM_WIDTH
  const maxEstimate = Math.max(1, Math.floor((availableWidth + ITEM_GUTTER) / (MIN_ITEM_WIDTH + ITEM_GUTTER)));
  let columns = 1;
  for (let c = Math.min(maxEstimate, 6); c >= 1; c--) {
    const totalGutters = ITEM_GUTTER * (c - 1);
    const candidate = Math.floor((availableWidth - totalGutters) / c);
    if (candidate >= MIN_ITEM_WIDTH) {
      columns = c;
      break;
    }
  }

  // layout constants for consistent vertical spacing
  const LINE_HEIGHT = 18; // px per text line
  const LINES_PER_ITEM = 3;
  const ITEM_MIN_HEIGHT = LINE_HEIGHT * LINES_PER_ITEM; // reserve 3-line height

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) =>
            (Array.isArray(value) && value.length > 0) || "Please select at least 1",
        }}
        render={({ field, fieldState }) => (
          <View>
            {sections.map((section) => (
              <View key={section.key} style={styles.section}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelHeaderText}>{section.title}</Text>
                </View>

                <View
                  style={[
                    styles.optionsContainer,
                    shouldUseRow ? styles.optionsRow : null,
                  ]}
                >
                  {section.data.map((opt) => {
                    const checked =
                      Array.isArray(field.value) && field.value.includes(opt.value);

                    return (
                      <View
                        key={`${opt.value}-${opt.label}`}
                        style={[
                          styles.option,
                          {
                            flexBasis: `${100 / columns}%`,
                            maxWidth: `${100 / columns}%`,
                            minHeight: ITEM_MIN_HEIGHT,
                            paddingVertical: 6,
                          },
                        ]}
                      >
                        <View style={styles.checkboxWrapper}>
                          <Checkbox
                            value={checked}
                            onValueChange={(newChecked) => {
                              const current = Array.isArray(field.value) ? field.value : [];
                              const newValue = newChecked
                                ? [...current, opt.value]
                                : current.filter((v: string) => v !== opt.value);
                              field.onChange(newValue);
                            }}
                          />
                        </View>

                        <Text style={[styles.optionLabel, { lineHeight: LINE_HEIGHT }]}>
                          {opt.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.sectionSeparator} />
              </View>
            ))}

            {fieldState.error && (
              <Text style={styles.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
  },
  levelHeader: {
    backgroundColor: "#f2f6ff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  levelHeaderText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#0b5cff",
    textTransform: "uppercase",
  },
  // options container acts as a wrapping row so items become grid cells
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginHorizontal: -8, // compensate for item padding
  },
  optionsRow: {
    // kept for clarity; grid handled by flexBasis on items
  },
  option: {
    flexDirection: "row",
    alignItems: "center", // center checkbox vertically relative to the reserved height
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  // wrapper to ensure checkbox stays centered and doesn't affect text flow
  checkboxWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 28, // fixed space for checkbox to keep alignment consistent
  },
  optionLabel: {
    marginLeft: 8,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 12,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});