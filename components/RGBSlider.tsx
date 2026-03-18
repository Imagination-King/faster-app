// components/RGBSlider.tsx
import Slider from "@react-native-community/slider";
import { Text, TextInput, View } from "react-native";
import { styles } from "../app/styles/settingsPageStyles";

interface RGBSliderProps {
  label: string;
  value: number;
  color: string;
  onChange: (val: number) => void;
}

export const RGBSlider = ({
  label,
  value,
  color,
  onChange,
}: RGBSliderProps) => (
  <View style={styles.sliderContainer}>
    <View style={styles.sliderLabelRow}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderValueContainer}>
        <TextInput
          style={styles.sliderValue}
          value={value.toString()}
          onChangeText={(text) =>
            onChange(Math.max(0, Math.min(255, parseInt(text) || 0)))
          }
          keyboardType="number-pad"
          maxLength={3}
          selectTextOnFocus={true}
        />
      </View>
    </View>

    <Slider
      style={{ width: "100%", height: 40 }}
      minimumValue={0}
      maximumValue={255}
      step={1}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor={color}
      maximumTrackTintColor="#D3D3D3"
      thumbTintColor={color}
    />
  </View>
);
