import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../../components/Home/HomeScreen';

export default function Homepage() {
  return (
    <View className="flex-1 bg-gray-300">
      <HomeScreen></HomeScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   },
});
