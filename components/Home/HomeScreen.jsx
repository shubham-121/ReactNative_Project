import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import DailyForecast from './DailyForecast';
import ExtraData from './ExtraData';
import gradientBG from './../../assets/gradientBG.jpg';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import HourlyForecast from './HourlyForecast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import RenderWeather from './RenderWeather';

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [weatherData, setWeatherData] = useState(null);

  const [savedLocations, setSavedLocations] = useState(null);

  const { width } = useWindowDimensions();

  useEffect(() => {
    async function getExistingSavedLocations() {
      const existingSavedLocations = await AsyncStorage.getItem('savedLocations');
      if (!existingSavedLocations) {
        console.log('No existing location', existingSavedLocations);
        return;
      }

      console.log('Exsiting locations found:', JSON.parse(existingSavedLocations));
      setSavedLocations(JSON.parse(existingSavedLocations));
    }
    getExistingSavedLocations();
  }, []);

  return (
    <View className="flex-1">
      <ImageBackground
        source={gradientBG}
        resizeMode="cover"
        className="absolute bottom-0 left-0 right-0 top-0"
      />

      <FlatList
        data={savedLocations}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator
        renderItem={({ item, index }) => (
          <View style={{ width }}>
            <ScrollView contentContainerStyle={{ padding: 40 }} nestedScrollEnabled={true}>
              <Text>{item}</Text>
              <RenderWeather
                weatherData={weatherData}
                setWeatherData={setWeatherData}
                savedUserLocation={item}
              />
              <HourlyForecast
                weatherData={weatherData}
                setWeatherData={setWeatherData}
                savedUserLocation={item}
              />
              {/* <DailyForecast /> */}
              <ExtraData
                weatherData={weatherData}
                setWeatherData={setWeatherData}
                savedUserLocation={item}
              />
            </ScrollView>
          </View>
        )}></FlatList>
    </View>
  );
}

//  <FlatList
//    data={savedLocations}
//    keyExtractor={(item, index) => index.toString()}
//    horizontal
//    pagingEnabled
//    showsHorizontalScrollIndicator={false}
//    renderItem={({ item }) => (
//      <View
//        style={{ width }} // <-- this ensures ONE SCREEN PER SWIPE
//        className="flex-1 flex-col border-2 border-black p-10">
//        <Text className="text-3xl font-bold text-white">{item}</Text>

//        {/* Pass the location string to your details component */}
//        <RenderWeather location={item} weatherData={weatherData} setWeatherData={setWeatherData} />
//        <HourlyForecast location={item} weatherData={weatherData} setWeatherData={setWeatherData} />
//        <DailyForecast location={item} />
//        <ExtraData location={item} weatherData={weatherData} setWeatherData={setWeatherData} />
//      </View>
//    )}
//  />;

//////////////////////

// <ScrollView
//   contentContainerStyle={{
//     paddingTop: 20,
//     paddingHorizontal: 16,
//     flexGrow: 1,
//     paddingBottom: tabBarHeight + 10,
//   }}
//   showsVerticalScrollIndicator={false}>
//   {savedLocations ? (
//     <FlatList
//       data={savedLocations}
//       horizontal
//       pagingEnabled
//       renderItem={({ item }) => (
//         <>
//           <RenderWeather weatherData={weatherData} setWeatherData={setWeatherData} />
//           <HourlyForecast
//             locationName={item}
//             weatherData={weatherData}
//             setWeatherData={setWeatherData}></HourlyForecast>
//         </>
//       )}></FlatList>
//   ) : (
//     <>
//       <RenderWeather weatherData={weatherData} setWeatherData={setWeatherData} />
//       <HourlyForecast
//         weatherData={weatherData}
//         setWeatherData={setWeatherData}></HourlyForecast>
//     </>
//   )}
//   <PagerView initialPage={0} scrollEnabled={true}>
//     <View key={1}>
//       <RenderWeather weatherData={weatherData} setWeatherData={setWeatherData} />
//     </View>
//     <View key={2}>
//       <HourlyForecast
//         weatherData={weatherData}
//         setWeatherData={setWeatherData}></HourlyForecast>
//     </View>
//   </PagerView>
// </ScrollView>;
