import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

import RenderWeather from './RenderWeather';

export default function HomeScreen() {
  return (
    <>
      <RenderWeather></RenderWeather>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
