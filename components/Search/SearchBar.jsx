import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../../app/_layout';

export default function SearchBar({ searchCity, setsearchCity }) {
  const [searchCityData, setSearchCityData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const inset = useSafeAreaInsets();
  const { deviceThemeMode, setdeviceThemeMode } = useContext(ThemeContext);

  async function fetchSearchedCityWeather() {
    if (!searchCity) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
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
            <View className="mx-auto mt-6 w-[90%] rounded-xl border border-gray-700 bg-gray-600/80 p-4">
              {/* City Name */}
              <Text className="text-2xl font-bold text-white">{searchCityData?.name}</Text>

              {/* AQI + Temps Row */}
              <View className="mt-3 flex flex-row items-start justify-between">
                <View>
                  <Text className="text-base text-white">AQI: 72 (Good)</Text>
                  <Text className="mt-1 text-sm text-white">
                    Max: {(searchCityData?.main?.temp_max).toFixed(1)}°C
                  </Text>
                  <Text className="text-sm text-white">
                    Min: {(searchCityData?.main?.temp_min).toFixed(1)}°C
                  </Text>
                </View>

                {/* Right side: Temp + Add Button */}
                <View className="items-end">
                  {/* Open the entered location weather screen */}
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/searchedCity',
                        params: { data: JSON.stringify(searchCityData) }, // 👈 wrap it as an object
                      })
                    }>
                    <Text className=" border-2 border-black p-1 text-xl font-semibold"> View</Text>
                  </Pressable>
                  <Text className="text-4xl font-bold text-white">
                    {(searchCityData?.main?.temp).toFixed(1)}°C
                  </Text>
                  <Pressable
                    onPress={saveSearchedCity}
                    className="mt-2 rounded-md bg-white/20 px-3 py-1 active:bg-white/30">
                    <Text className="text-sm font-semibold text-white">Add</Text>
                  </Pressable>

                  <Pressable
                    onPress={getSavedCities}
                    className="mt-2 rounded-md bg-white/20 px-3 py-1 active:bg-white/30">
                    <Text className="text-sm font-semibold text-white">Get Saved city</Text>
                  </Pressable>
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

// https://api.openweathermap.org/data/2.5/weather?q=London&appid={API key}

// const lat = 30.3525997;
// const lon = 78.0191896;
const API_KEY = 'eb2afa1fdab203f1c97ade85de93dd03';
