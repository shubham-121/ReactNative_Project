import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext, UnitContext } from '../../app/_layout';
import { useRouter } from 'expo-router';
import { isTemplateExpression } from 'typescript';
import { useIsFocused } from '@react-navigation/native';

export default function SavedLocationsCardList() {
  const [savedLocations, setSavedLocations] = useState(null);

  const { deviceThemeMode } = useContext(ThemeContext);

  const isFocussed = useIsFocused();

  async function getExistingSavedLocations() {
    const existingSavedLocations = await AsyncStorage.getItem('savedLocations');
    if (!existingSavedLocations) {
      console.log('No existing location', existingSavedLocations);
      return;
    }

    console.log('Exsiting locations found:', JSON.parse(existingSavedLocations));
    setSavedLocations(JSON.parse(existingSavedLocations));
  }

  useEffect(() => {
    if (isFocussed) getExistingSavedLocations();
  }, [isFocussed]);

  console.log('Saved locations:', savedLocations, typeof savedLocations);
  return (
    <View className="flex-1 px-4 py-2">
      <Text
        className={`mb-4 text-xl font-bold ${
          deviceThemeMode === 'light' ? 'text-black' : 'text-white'
        }`}>
        {savedLocations && savedLocations.length > 0
          ? 'Your Saved Locations'
          : 'No Saved Locations'}
      </Text>

      {/* <FlatList
        data={savedLocations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <>
            <RenderSavedLocationsCardList
              savedLocations={savedLocations}
              setSavedLocations={setSavedLocations}
              locationName={item}
            />
          </>
        )}>

        </FlatList> */}

      {savedLocations &&
        savedLocations.map((location, indx) => (
          <View key={location}>
            <RenderSavedLocationsCardList
              locationName={location}
              savedLocations={savedLocations}
              setSavedLocations={setSavedLocations}></RenderSavedLocationsCardList>
          </View>
        ))}
    </View>
  );
}

function RenderSavedLocationsCardList({ savedLocations, setSavedLocations, locationName }) {
  const [locationData, setLocationData] = useState(null);

  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  // console.log('API KEY', process.env.EXPO_PUBLIC_WEATHER_API_KEY);

  const router = useRouter();
  const { preferredUnit } = useContext(UnitContext);

  // console.log('LocationName is: ', locationName);

  useEffect(() => {
    if (!locationName) return;

    async function fetchDataByLocationName() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${apiKey}&units=${preferredUnit}`
        );
        const data = await res.json();

        // if (data.cod !== 200) {
        //   console.error('Error in fetching the location data');
        //   return;
        // }

        console.log('saved location fetch data:', data);
        setLocationData(data);
      } catch (error) {
        console.error('Error occured:', error.message);
      }
    }
    fetchDataByLocationName();
  }, [preferredUnit, apiKey, locationName]);

  async function removeSavedLocation(removeLocationName) {
    console.log('Remove location name', removeLocationName);
    if (!removeLocationName) return;

    try {
      const data = await AsyncStorage.getItem('savedLocations');

      const locations = JSON.parse(data);

      const updatedLocations = locations.filter((loc) => loc !== removeLocationName);

      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));

      setSavedLocations(updatedLocations);

      console.log('updated locations from storage', updatedLocations);
    } catch (error) {
      console.error('Error occured while removing the location', error.message);
    }
  }

  if (!savedLocations || savedLocations.length === 0 || !locationName)
    return <Text className="text-center text-xl font-semibold">No Saved Locations Present</Text>;

  return (
    <>
      {locationData ? (
        <View className="mx-auto mt-2 w-[95%] rounded-xl border border-gray-600 bg-gray-700/70 p-3 shadow-sm shadow-black/20">
          {/* City Name */}

          <Text className="mb-1 text-lg font-bold text-white">{locationData?.name}</Text>

          {/* Weather + Temp */}
          <View className="flex-row items-start justify-between">
            {/* Left Side: AQI + Min/Max */}
            <View className="space-y-1">
              <Text className="text-xs text-gray-300">AQI: 72 (Good)</Text>
              <Text className="text-xs text-gray-300">
                Max: {(locationData?.main?.temp_max).toFixed(1)}°C
              </Text>
              <Text className="text-xs text-gray-300">
                Min: {(locationData?.main?.temp_min).toFixed(1)}°C
              </Text>
            </View>

            {/* Right Side: Current Temp + Buttons */}
            <View className="items-end space-y-1">
              <Text className="text-xl font-bold text-white">
                {(locationData?.main?.temp).toFixed(1)}°C
              </Text>

              <Pressable
                className="rounded-md bg-white/20 px-2 py-1 active:bg-white/30"
                onPress={() =>
                  router.push({
                    pathname: '/searchedCity',
                    params: { data: JSON.stringify(locationData) },
                  })
                }>
                <Text className="text-[10px] font-semibold text-white">View &rarr;</Text>
              </Pressable>

              <Pressable
                onPress={() => removeSavedLocation(locationName)}
                className="rounded-md bg-white/20 px-2 py-1 active:bg-white/30">
                <Text className="text-[10px] font-semibold text-white">Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Text>No saved locations</Text>
      )}
    </>
  );
}
