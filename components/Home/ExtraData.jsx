import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ExtraData({ weatherData }) {
  // console.log('Weather data in extra data:', weatherData);
  return (
    <View className="z-50  mt-[10%] flex-row justify-center gap-8">
      <SunriseSunset weatherData={weatherData}></SunriseSunset>
      <UVIndex weatherData={weatherData}></UVIndex>
    </View>
  );
}

function SunriseSunset({ weatherData }) {
  function convertUnixToTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <View className="flex-col items-center rounded-[20px] border-2 border-white px-6 py-4">
      <Text className="mb-2 text-2xl font-semibold tracking-wide text-gray-200">
        Sunrise & Sunset
      </Text>

      <View className="mt-2 space-y-1">
        <Text className="text-center text-lg text-white">
          Sunrise:{' '}
          <Text className="font-bold text-white">
            {convertUnixToTime(weatherData?.sys?.sunrise)}
          </Text>
        </Text>

        <Text className="text-center text-lg text-white">
          Sunset:{' '}
          <Text className="font-bold text-white">
            {convertUnixToTime(weatherData?.sys?.sunset)}
          </Text>
        </Text>
      </View>
    </View>
  );
}

function UVIndex({ weatherData }) {
  return (
    <View className="flex-col items-center rounded-[20px] border-2 border-white p-6">
      <Text className="mb-3 text-xl font-semibold tracking-wide text-gray-200">💨 Wind</Text>

      <Text className="text-lg font-bold text-white">{weatherData?.wind?.speed} m/s</Text>

      <Text className="text-md mt-1 text-gray-300">
        {weatherData?.wind?.speed > 8
          ? 'Strong Winds'
          : weatherData?.wind?.speed > 4
            ? 'Moderate Breeze'
            : 'Light Breeze'}
      </Text>
    </View>
  );
}
