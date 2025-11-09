import { View, Text, StyleSheet, ImageBackground, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderWeather from '../components/Home/RenderWeather';
import gradientBG from '../assets/gradientBG.jpg';
import HourlyForecast from '../components/Home/HourlyForecast';
import ExtraData from '../components/Home/ExtraData';
import { Ionicons } from '@expo/vector-icons'; // for a nice arrow icon

export default function SearchedCity() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const locationData = data ? JSON.parse(data) : null;

  console.log('In stack screen', typeof locationData, locationData);
  return (
    <SafeAreaView edges={['top']} className="flex-1 pb-0">
      <ScrollView showsVerticalScrollIndicator={true}>
        <View className="flex-1 border-2 bg-gray-400">
          <ImageBackground
            source={gradientBG}
            resizeMode="cover"
            className="absolute bottom-0 left-0 right-0 top-0"
          />
          {/* Top bar */}
          <View className="flex-row justify-end px-4 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="rounded-full bg-black/40 p-2 active:bg-black/60">
              <Ionicons name="arrow-back" size={26} color="white" />
            </Pressable>
          </View>

          {/* Main content */}
          <View className="flex-1">
            <RenderWeather weatherData={locationData} />
            <HourlyForecast />
            <ExtraData />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
