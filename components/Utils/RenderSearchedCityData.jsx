import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';

import House from './../../assets/weather/House.jpg';
import weatherPic from './../../assets/weather/weatherPic.jpg';
import { useContext, useEffect, useState } from 'react';
import Error from './Error';
import { convertTime } from './helperFunctions/convertTime';
import * as Location from 'expo-location';
import { ThemeContext, UnitContext } from '../../app/_layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import gradientBG from '../../assets/gradientBG.jpg';
import { darkTheme, lightTheme } from './helperFunctions/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ExtraData from '../Home/ExtraData';
import { getTodayDate } from './helperFunctions/getTodayDate';
// import HourlyForecast from '../Home/HourlyForecast';

// calling the weather API here by city name
export default function RenderSearchedCityData({ locationData }) {
  console.log('location data in rendersearchedcitydata', locationData);

  const { deviceThemeMode, setdeviceThemeMode } = useContext(ThemeContext);
  const theme = deviceThemeMode === 'light' ? lightTheme : darkTheme;

  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 border-2 bg-gray-400 p-4">
          <Text className="z-50 text-center text-3xl font-bold  text-white">
            {locationData?.name}
          </Text>

          <View className="z-50 flex-row justify-end px-4 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="rounded-full bg-black/40 p-2 active:bg-black/60">
              <Ionicons name="arrow-back" size={26} color="white" />
            </Pressable>
          </View>

          <ImageBackground
            source={gradientBG}
            resizeMode="cover"
            className="absolute bottom-0 left-0 right-0 top-0"
          />

          {/* Overlay */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor:
                deviceThemeMode === 'light' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)',
            }}
          />

          <WeatherDetails locationData={locationData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WeatherDetails({ locationData }) {
  const { preferredUnit, setPreferredUnit } = useContext(UnitContext);

  return (
    <>
      <View className="w-full rounded-2xl  p-6 ">
        {/* Temperature & Condition */}
        <View className="mb-6 flex-col items-center justify-center">
          <Text className="text-5xl font-bold text-white">
            {Math.round(locationData?.main?.temp)}
            {preferredUnit === 'standard' ? ' F' : '° C'}
          </Text>
          <Text className="text-xl font-medium text-white">{locationData?.weather[0]?.main}</Text>
        </View>

        {/* Max & Min */}
        <View className="mb-4 flex-row justify-center gap-8">
          <Text className="text-lg font-semibold text-white">
            Max: {Math.ceil(locationData?.main?.temp_max)}°
          </Text>
          <Text className="text-lg font-semibold text-white">
            Min: {Math.floor(locationData?.main?.temp_min)}°
          </Text>
        </View>

        {/* Humidity */}
        <Text className="mb-2 text-center text-lg font-semibold text-white">
          Humidity: {locationData?.main?.humidity}%
        </Text>

        {/* Sunrise & Sunset */}
        <View className="mt-4 flex-row justify-around">
          <Text className="text-center text-lg font-semibold text-amber-600">
            Sunrise: {convertTime(locationData?.sys?.sunrise)}
          </Text>
          <Text className="text-center text-lg font-semibold text-orange-600">
            Sunset: {convertTime(locationData?.sys?.sunset)}
          </Text>
        </View>
      </View>

      <View className="items-center justify-center">
        <Image
          source={House}
          className="object-fit m-[2%] "
          style={{ height: 150, width: 200 }}></Image>
      </View>

      <HourlyForecast locationName={locationData?.name}></HourlyForecast>
      <ExtraData />
    </>
  );
}

function HourlyForecast({ locationName }) {
  const getTodaysDate = () => new Date().toISOString().split('T')[0]; //function to dynamically get the device date first in this format: 2025-11-05 -> YY:MM:DD

  const [targetDate, setTargetDate] = useState(getTodaysDate()); //'2025-11-05'

  const [threeHourData, setthreeHourData] = useState(null); //state for holding the forecasted data
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

  console.log('date:', getTodaysDate());

  useEffect(() => {
    if (!locationName) return;

    async function threeHourlyForecast() {
      try {
        const res = await fetch(
          // `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`
          `https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        console.log('searchedCity data', locationName, data);

        if (data.cod !== '200') {
          console.error('Error in fetching the weather data');
          // setFetchError(true);
          // setFetchErrorMessage(data.message);
          return;
        }

        //extracting the one day data only
        const oneDayData = data.list.filter((d) => d.dt_txt.startsWith(targetDate));
        // console.log('Extracted data for one day:', oneDayData);

        // console.log('Hourly Weather data fetched:', data);
        setthreeHourData(oneDayData);
      } catch (err) {
        console.error('Error in fetching the weather data', err.message);
        //   setFetchError(true);
        //   setFetchErrorMessage('Sorry! Unable To Fetch The Data');
      }
    }
    threeHourlyForecast();
  }, [targetDate, locationName, apiKey]);
  return (
    <>
      <View className="rounded-3xl border border-gray-300 bg-white/40 p-5 shadow-md backdrop-blur-xl">
        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-lg font-semibold text-gray-800">Today</Text>
          <Text className="text-base text-gray-600">{getTodayDate(targetDate)}</Text>
        </View>

        <View className="my-3 h-[1px] bg-gray-300" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {locationName ? (
            <View className="flex-row gap-6">
              {threeHourData &&
                threeHourData.map((data, indx) => (
                  <View key={indx} className="items-center space-y-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {Math.round(data?.main?.temp)}°
                    </Text>

                    <Image
                      source={weatherPic}
                      style={{ height: 50, width: 50, borderRadius: 14 }}
                    />

                    <Text className="text-xs text-gray-600">
                      {data?.dt_txt.split(' ')[1].slice(0, 5)}
                    </Text>
                  </View>
                ))}
            </View>
          ) : (
            <View className="h-20 w-full items-center justify-center">
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </ScrollView>
      </View>

      {/* <ExtraData weatherData={weatherData} setWeatherData={setWeatherData} /> */}
    </>
  );
}
