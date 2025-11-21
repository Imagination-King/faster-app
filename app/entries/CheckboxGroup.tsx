import React from "react";
import { Control, Controller } from "react-hook-form";

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
    <div style={{ display: row ? "flex" : "block", gap: "1rem" }}>
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) =>
            (Array.isArray(value) && value.length > 0) ||
            "Please select at least 1",
        }}
        render={({ field, fieldState }) => (
          <div>
            {options.map((opt) => {
              const checked =
                Array.isArray(field.value) && field.value.includes(opt.value);

              return (
                <label
                  key={`${opt.value}-${opt.label}`}
                  style={{
                    marginRight: "1rem",
                    display: row ? "inline-block" : "block",
                  }}
                >
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={checked}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...field.value, opt.value]
                        : field.value.filter((v: string) => v !== opt.value);

                      field.onChange(newValue);
                    }}
                  />
                  {opt.label}
                </label>
              );
            })}

            {fieldState.error && (
              <p style={{ color: "red" }}>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};
