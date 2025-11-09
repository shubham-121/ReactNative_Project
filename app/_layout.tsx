// import { StatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

import { Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" backgroundColor="transparent" translucent />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="searchedCity" options={{ headerShown: false }}></Stack.Screen>
      </Stack>
    </>
  );
}
