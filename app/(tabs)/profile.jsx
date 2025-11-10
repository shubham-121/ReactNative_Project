import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import ProfileScreen from '../../components/profile/ProfileScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 pb-0">
      <ProfileScreen></ProfileScreen>
    </SafeAreaView>
  );
}
