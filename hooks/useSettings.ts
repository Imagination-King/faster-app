import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type LevelColors = Record<string, string>;

export interface AppSettings {
  userName: string;
  levelColors: LevelColors;
}

const DEFAULT_LEVEL_COLORS: LevelColors = {
  G: "#6FCF97",
  F: "#F6A623",
  A: "#F63B3B",
  S: "#50E3C2",
  T: "#B388FF",
  E: "#F8E71C",
  R: "#FF6B6B",
};

const DEFAULT_SETTINGS: AppSettings = {
  userName: "",
  levelColors: DEFAULT_LEVEL_COLORS,
};

const SETTINGS_KEY = "appSettings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({
            userName: parsed.userName || "",
            levelColors: { ...DEFAULT_LEVEL_COLORS, ...parsed.levelColors },
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const updateUserName = async (userName: string) => {
    await updateSettings({ userName });
  };

  const updateLevelColor = async (level: string, color: string) => {
    const newColors = { ...settings.levelColors, [level]: color };
    await updateSettings({ levelColors: newColors });
  };

  const resetColors = async () => {
    await updateSettings({ levelColors: DEFAULT_LEVEL_COLORS });
  };

  return {
    settings,
    isLoading,
    updateUserName,
    updateLevelColor,
    resetColors,
  };
}
