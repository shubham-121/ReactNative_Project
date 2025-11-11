import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ThemeContext, UnitContext } from '../../app/_layout';

export default function SearchBar({ searchCity, setsearchCity }) {
  const [searchCityData, setSearchCityData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const inset = useSafeAreaInsets();
  const { deviceThemeMode } = useContext(ThemeContext);
  const { preferredUnit } = useContext(UnitContext);

  async function fetchSearchedCityWeather() {
    if (!searchCity) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=${preferredUnit}`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setErrorMsg("Error in searching the city's weather");
        return;
      }

      console.log('Searched city data:', data);
      setSearchCityData(data);
    } catch (error) {
      console.log('Error in fetching searched city:', error.message);
      setErrorMsg("Error in searching the city's weather");
    }
  }

  // fetchSearchedCityWeather();

  useEffect(() => {
    if (!searchCity) setSearchCityData(null);
  }, [searchCity]);

  return (
    <>
      <View
        className="flex flex-row justify-center "
        style={{ marginTop: inset.top, paddingVertical: 10 }}>
        <View
          className={`w-[85%] flex-row items-center justify-between rounded-xl border px-4 py-2 shadow-md shadow-black/10 ${
            deviceThemeMode === 'light'
              ? 'border-gray-400 bg-white'
              : 'border-gray-500 bg-transparent'
          }`}>
          <TextInput
            placeholder="Enter Location"
            placeholderTextColor={deviceThemeMode === 'light' ? '#555' : '#aaa'}
            className={`flex-1 text-lg font-semibold ${
              deviceThemeMode === 'light' ? 'text-black' : 'text-white'
            }`}
            value={searchCity}
            onChangeText={setsearchCity}
          />
          <Pressable className="ml-3 active:opacity-70" onPress={fetchSearchedCityWeather}>
            <Text className="text-2xl">{`🔍`}</Text>
          </Pressable>
        </View>
      </View>
      <View className="flex-1   border-2 ">
        <SeachedCityData
          searchCityData={searchCityData}
          setSearchCityData={setSearchCityData}
          searchCity={searchCity}></SeachedCityData>
      </View>
    </>
  );
}

function SeachedCityData({ searchCityData, setSearchCityData, searchCity }) {
  const router = useRouter();

  console.log('searched city data:', searchCityData);

  async function saveSearchedCity() {
    try {
      const stored = await AsyncStorage.getItem('savedLocations');

      const cityList = stored ? JSON.parse(stored) : [];

      cityList.push(searchCity);

      await AsyncStorage.setItem('savedLocations', JSON.stringify(cityList));

      console.log('City saved:', searchCity);
    } catch (error) {
      console.log('SaveCity error:', error);
    }
  }

  async function getSavedCities() {
    try {
      const stored = await AsyncStorage.getItem('savedLocations');
      const cityList = stored ? JSON.parse(stored) : [];

      console.log('Saved cities:', cityList, 'Type:', typeof cityList);
      return cityList;
    } catch (error) {
      console.log('Fetch error:', error);
    }
  }

  return (
    <>
      {
        searchCityData && (
          <>
            <View className="mx-auto  mt-6 w-[90%] rounded-2xl bg-gray-700/70 p-5 shadow-lg shadow-black/30">
              {/* City Name */}
              <Text className="text-center text-2xl font-bold tracking-wide text-white">
                {searchCityData?.name}
              </Text>

              {/* Weather Details Row */}
              <View className=" flex flex-row items-center justify-between">
                {/* Left Side */}
                <View>
                  <Text className="text-md  text-gray-200">AQI: 72 (Good)</Text>
                  <Text className="text-md mt-1  text-gray-200">
                    Max: {searchCityData?.main?.temp_max.toFixed(1)}°C
                  </Text>
                  <Text className="text-md text-gray-200">
                    Min: {searchCityData?.main?.temp_min.toFixed(1)}°C
                  </Text>
                </View>

                {/* Right Side */}
                <View className="items-end">
                  {/* Temperature */}
                  <Text className="mb-1 text-4xl font-extrabold text-white">
                    {searchCityData?.main?.temp.toFixed(1)}°C
                  </Text>

                  {/* View Button */}
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/searchedCity',
                        params: { data: JSON.stringify(searchCityData) },
                      })
                    }
                    className="mt-1 rounded-lg bg-blue-500/70 px-4 py-2 active:bg-blue-600/80">
                    <Text className="text-sm font-semibold text-white">View Details</Text>
                  </Pressable>

                  {/* Add Button */}
                  <Pressable
                    onPress={saveSearchedCity}
                    className="mt-2 rounded-lg bg-green-500/70 px-4 py-2 active:bg-green-600/80">
                    <Text className="text-sm font-semibold text-white">Add to Saved</Text>
                  </Pressable>

                  {/* Debug Button */}
                  {/* <Pressable
                    onPress={getSavedCities}
                    className="mt-2 rounded-lg bg-white/20 px-3 py-1 active:bg-white/30">
                    <Text className="text-xs font-semibold text-white">
                      View Saved List (Debug)
                    </Text>
                  </Pressable> */}
                </View>
              </View>
            </View>
          </>
        )
        // : (
        //   <ActivityIndicator size="large" color="blue" />
        // )
      }
    </>
  );
}

const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
