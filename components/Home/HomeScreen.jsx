import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import RenderWeather from './RenderWeather';
import DailyForecast from './DailyForecast';
import ExtraData from './ExtraData';
import gradientBG from './../../assets/gradientBG.jpg';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import HourlyForecast from './HourlyForecast';

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [weatherData, setWeatherData] = useState(null);

  return (
    <View className="flex-1">
      <ImageBackground
        source={gradientBG}
        resizeMode="cover"
        className="absolute bottom-0 left-0 right-0 top-0"
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 16,
          flexGrow: 1,
          paddingBottom: tabBarHeight + 10,
        }}
        showsVerticalScrollIndicator={false}>
        <RenderWeather weatherData={weatherData} setWeatherData={setWeatherData} />
        <HourlyForecast weatherData={weatherData} setWeatherData={setWeatherData}></HourlyForecast>
      </ScrollView>
    </View>
  );
}
