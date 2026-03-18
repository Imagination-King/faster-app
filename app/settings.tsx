import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RGBSlider } from ".././components/RGBSlider";
import { useSettings } from "../hooks/useSettings";
import { hexToRgb, rgbToHex } from "../utils/colorConversion";
import { LEVEL_LABELS, ORDER, PRESET_COLORS } from "./constants/levels";
import { styles } from "./styles/settingsPageStyles";

export default function SettingsPage() {
  const { settings, updateUserName, updateLevelColor, resetColors } =
    useSettings();
  const [userName, setUserName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [colorState, setColorState] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    setUserName(settings.userName);
  }, [settings.userName]);

  const handleLevelToggle = (level: string) => {
    if (selectedLevel === level) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(level);
      const rgb = hexToRgb(settings.levelColors[level]);
      setColorState(rgb);
    }
  };

  const onApplyColor = async () => {
    if (selectedLevel) {
      const hex = rgbToHex(colorState.r, colorState.g, colorState.b);
      await updateLevelColor(selectedLevel, hex);
      setSelectedLevel(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* User Name Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Name</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            updateUserName(userName).then(() => Alert.alert("Success", "Saved"))
          }
        >
          <Text style={styles.buttonText}>Save Name</Text>
        </TouchableOpacity>
      </View>

      {/* Level Colors Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Level Colors</Text>
          <TouchableOpacity onPress={resetColors}>
            <Text style={styles.resetLink}>Reset all to Default</Text>
          </TouchableOpacity>
        </View>

        {ORDER.map((level) => (
          <View key={level}>
            <TouchableOpacity
              style={styles.levelRow}
              onPress={() => handleLevelToggle(level)}
            >
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>{LEVEL_LABELS[level]}</Text>
                <Text style={styles.levelCode}>{level}</Text>
              </View>
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: settings.levelColors[level] },
                ]}
              />
            </TouchableOpacity>

            {selectedLevel === level && (
              <View style={styles.colorPickerContainer}>
                <Text style={styles.colorTip}>
                  Pick a color preset or adjust the RGB sliders below for a
                  custom color.
                </Text>
                <View style={styles.presetGrid}>
                  {PRESET_COLORS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.presetColor,
                        {
                          backgroundColor: c,
                          borderWidth:
                            rgbToHex(
                              colorState.r,
                              colorState.g,
                              colorState.b,
                            ) === c
                              ? 3
                              : 0,
                        },
                      ]}
                      onPress={() => setColorState(hexToRgb(c))}
                    />
                  ))}
                </View>

                <View style={styles.rgbControlsContainer}>
                  <View style={styles.slidersColumn}>
                    <RGBSlider
                      label="Red"
                      value={colorState.r}
                      color="#E63946"
                      onChange={(r) => setColorState({ ...colorState, r })}
                    />
                    <RGBSlider
                      label="Green"
                      value={colorState.g}
                      color="#2AA54B"
                      onChange={(g) => setColorState({ ...colorState, g })}
                    />
                    <RGBSlider
                      label="Blue"
                      value={colorState.b}
                      color="#1F77E2"
                      onChange={(b) => setColorState({ ...colorState, b })}
                    />
                  </View>
                  {/* Live Preview Box */}
                  <View
                    style={[
                      styles.rgbPreview,
                      {
                        backgroundColor: rgbToHex(
                          colorState.r,
                          colorState.g,
                          colorState.b,
                        ),
                      },
                    ]}
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={onApplyColor}
                  >
                    <Text style={styles.applyButtonText}>Apply Color</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setSelectedLevel(null)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
