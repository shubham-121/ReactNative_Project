import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ExplorePage() {
  return (
    <View style={styles.container}>
      <Text>ExplorePage is this one</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
