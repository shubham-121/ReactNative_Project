import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import SearchScreen from '../../components/Search/SearchScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExplorePage() {
  return (
    <SafeAreaView className="flex-1 pb-0" edges={['top']}>
      <SearchScreen></SearchScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
