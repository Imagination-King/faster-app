import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    // Determine orientation based on window dimensions
    const newOrientation = width > height ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
  }, [width, height]);

  return orientation;
}

export async function lockOrientationAsync(orientation: 'portrait' | 'landscape' | 'all') {
  try {
    if (orientation === 'portrait') {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } else if (orientation === 'landscape') {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.unlockAsync();
    }
  } catch (error) {
    console.warn('Failed to set screen orientation:', error);
  }
}
