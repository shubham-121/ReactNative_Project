import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ExtraData(weatherData, setWeatherData) {
  return (
    <View className="z-50  mt-[10%] flex-row justify-center gap-8">
      <SunriseSunset></SunriseSunset>
      <UVIndex></UVIndex>
    </View>
  );
}

function SunriseSunset() {
  return (
    <View className="flex-col  rounded-[20px] border-2 border-white p-10">
      <Text className="text2xl text-gray-200 ">🌄Sunrise</Text>
      <Text>5:28 </Text>
      <Text>Sunset: 7:25</Text>
    </View>
  );
}

function UVIndex() {
  return (
    <View className="flex-col rounded-[20px] border-2 border-white p-10">
      <Text className="text2xl text-gray-200 ">🌄UV INDEX</Text>
      <Text>4 </Text>
      <Text>Moderate</Text>
    </View>
  );
}
