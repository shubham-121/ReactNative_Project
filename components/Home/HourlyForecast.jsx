import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import weatherPic from './../../assets/weather/weatherPic.jpg';
import { useEffect, useState } from 'react';
import { getTodayDate } from '../Utils/helperFunctions/getTodayDate';
import ExtraData from './ExtraData';
import * as Location from 'expo-location';

export default function HourlyForecast({ weatherData, setWeatherData }) {
  //3 hour forecast one day data component

  const getTodaysDate = () => new Date().toISOString().split('T')[0]; //function to dynamically get the device date first in this format: 2025-11-05 -> YY:MM:DD

  //   const [targetDate, setTargetDate] = useState(getTodaysDate()); //set the current day date for fetching data
  const [targetDate, setTargetDate] = useState(getTodaysDate()); //'2025-11-05'

  const [threeHourData, setthreeHourData] = useState(null); //state for holding the forecasted data

  // const [fetchError, setFetchError] = useState(false);
  // const [fetchErrorMessage, setFetchErrorMessage] = useState('');

  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setlocationErrorMsg] = useState('');

  useEffect(() => {
    async function getUserLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      // if (status !== 'granted') {
      //   console.log('location access deny', status);
      //   locationErrorMsg('Permission to access location was denied');
      //   return;
      // }

      if (status === 'granted') {
        const userLocation = await Location.getCurrentPositionAsync();
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          source: 'device', //using accurate device location
        });

        console.log('User location fetched automatically:', userLocation);
      } else {
        try {
          let res = await fetch('https://ipapi.co/json/');
          let data = await res.json();
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            country_name: data.country_name,
            source: 'ip', //using network based location
          });
        } catch (e) {
          // setlocationErrorMsg('Permission to access location was denied');
        }
      }
    }

    getUserLocation();
  }, []);

  useEffect(() => {
    if (!location) return;

    async function threeHourlyForecast() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        // if (data.cod !== 200) {
        //   console.error('Error in fetching the weather data');
        //   // setFetchError(true);
        //   // setFetchErrorMessage(data.message);
        //   //   return;
        // }

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
  }, [targetDate, location]);

  //   useEffect(() => {
  //     console.log('Three hour data updated', threeHourData);
  //   }, [threeHourData]);

  return (
    <>
      <View className="rounded-3xl border border-gray-300 bg-white/40 p-5 shadow-md backdrop-blur-xl">
        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-lg font-semibold text-gray-800">Today</Text>
          <Text className="text-base text-gray-600">{getTodayDate(targetDate)}</Text>
        </View>

        <View className="my-3 h-[1px] bg-gray-300" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {location ? (
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

      <ExtraData weatherData={weatherData} setWeatherData={setWeatherData} />
    </>
  );
}

const API_KEY = 'eb2afa1fdab203f1c97ade85de93dd03';
