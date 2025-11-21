import { Checkbox } from "expo-checkbox";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: Option[];
  row?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  control,
  name,
  label,
  options,
  row,
}) => {
  return (
    <View style={[row ? styles.rowContainer : styles.columnContainer]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) =>
            (Array.isArray(value) && value.length > 0) ||
            "Please select at least 1",
        }}
        render={({ field, fieldState }) => (
          <View>
            {options.map((opt) => {
              const checked =
                Array.isArray(field.value) && field.value.includes(opt.value);

              return (
                <View key={`${opt.value}-${opt.label}`} style={styles.option}>
                  <Checkbox
                    value={checked}
                    onValueChange={(newChecked) => {
                      const newValue = newChecked
                        ? [...field.value, opt.value]
                        : field.value.filter((v: string) => v !== opt.value);
                      field.onChange(newValue);
                    }}
                  />
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                </View>
              );
            })}

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
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  columnContainer: {
    flexDirection: "column",
    gap: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  optionLabel: {
    marginLeft: 8,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
