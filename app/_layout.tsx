// import { StatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

import { Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { createContext, useContext, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export const ThemeContext = createContext('');
export const UnitContext = createContext('');

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [preferredUnit, setPreferredUnit] = useState('metric');

  const [deviceThemeMode, setdeviceThemeMode] = useState('light');

  return (
    <>
      <ThemeContext.Provider value={{ deviceThemeMode, setdeviceThemeMode }}>
        <UnitContext.Provider value={{ preferredUnit, setPreferredUnit }}>
          <StatusBar style="auto" backgroundColor="transparent" translucent />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="searchedCity" options={{ headerShown: false }}></Stack.Screen>
          </Stack>
        </UnitContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}
