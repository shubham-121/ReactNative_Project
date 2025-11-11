import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function DailyForecast() {
  const [dailyForecastData, setdailyForecastData] = useState(null);

  useEffect(() => {
    async function fetchDailyForecast() {
      try {
        const res = await fetch(
          `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}`
        );
        const data = await res.json();

        // console.log('Daily forecast of 7 days:', data);
      } catch (err) {
        console.error('Error in fetching daily data ', err.message);
      }
    }
    fetchDailyForecast();
  }, []);

  return (
    <View>
      <Text>7 Days Daily Forecast</Text>
    </View>
  );
}

const lat = 30.3525997;
const lon = 78.0191896;
const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

// api.openweathermap.org/data/2.5/forecast/daily?lat=30.3525997&lon=78.0191896&cnt=7&appid=eb2afa1fdab203f1c97ade85de93dd03
