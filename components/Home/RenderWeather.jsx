import { View, Text, Image, ActivityIndicator, FlatList } from 'react-native';

import House from './../../assets/weather/House.jpg';
import weatherPic from './../../assets/weather/weatherPic.jpg';
import { useEffect, useState } from 'react';
import Error from '../Utils/Error';
import { convertTime } from '../Utils/helperFunctions/convertTime';
import HourlyForecast from './HourlyForecast';
import * as Location from 'expo-location';

// calling the weather API here
export default function RenderWeather({ weatherData, setWeatherData, savedUserLocation }) {
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState('');

  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setlocationErrorMsg] = useState('');

  // const [savedLocations,setSavedLocations]=useState(null)

  //1-fetch the user default location, through newtork or gps(permission needed)
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
          setlocationErrorMsg('Permission to access location was denied');
        }
      }
    }

    getUserLocation();
  }, []);

  //fetch the user location weather details
  useEffect(() => {
    if (!location) return;

    async function fetchWeatherDetails() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        if (data.cod !== 200) {
          console.error('Error in fetching the weather data');
          setFetchError(true);
          setFetchErrorMessage(data.message);
          return;
        }

        console.log('Weather data fetched:', data);
        setWeatherData(data);
      } catch (err) {
        console.error('Error in fetching the weather data', err.message);
        setFetchError(true);
        setFetchErrorMessage('Sorry! Unable To Fetch The Data');
      }
    }
    fetchWeatherDetails();
  }, [location]);

  //  useEffect(() => {
  //    async function getExistingSavedLocations() {
  //      const existingSavedLocations = await AsyncStorage.getItem('savedLocations');
  //      if (!existingSavedLocations) {
  //        console.log('No existing location', existingSavedLocations);
  //        return;
  //      }

  //      console.log('Exsiting locations found:', existingSavedLocations);
  //      setSavedLocations(existingSavedLocations)
  //    }
  //    getExistingSavedLocations();
  //  }, []);

  return (
    <>
      <View className="mb-8 items-center">
        <Text className="mb-4 text-center text-4xl font-bold tracking-wide text-sky-600">
          {weatherData?.name}
        </Text>
        <Image source={weatherPic} style={{ width: 100, height: 100, borderRadius: 30 }}></Image>
        {fetchError && <Error fetchErrorMessage={fetchErrorMessage}></Error>}
        {weatherData ? (
          <WeatherDetails
            weatherData={weatherData}
            setWeatherData={setWeatherData}></WeatherDetails>
        ) : (
          // <Text>Loading the weather data, please wait.....</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </>
  );
}

function WeatherDetails({ weatherData, setWeatherData }) {
  return (
    <>
      <View className="w-full rounded-2xl  p-6 ">
        {/* Temperature & Condition */}
        <View className="mb-6 flex-col items-center justify-center">
          <Text className="text-5xl font-bold text-white">
            {Math.round(weatherData?.main?.temp)}°
          </Text>
          <Text className="text-xl font-medium text-white">{weatherData?.weather[0]?.main}</Text>
        </View>

        {/* Max & Min */}
        <View className="mb-4 flex-row justify-center gap-8">
          <Text className="text-lg font-semibold text-white">
            Max: {Math.ceil(weatherData?.main?.temp_max)}°
          </Text>
          <Text className="text-lg font-semibold text-white">
            Min: {Math.floor(weatherData?.main?.temp_min)}°
          </Text>
        </View>

        {/* Humidity */}
        <Text className="mb-2 text-center text-lg font-semibold text-white">
          Humidity: {weatherData?.main?.humidity}%
        </Text>

        {/* Sunrise & Sunset */}
        <View className="mt-4 flex-row justify-around">
          <Text className="text-center text-lg font-semibold text-amber-600">
            Sunrise: {convertTime(weatherData?.sys?.sunrise)}
          </Text>
          <Text className="text-center text-lg font-semibold text-orange-600">
            Sunset: {convertTime(weatherData?.sys?.sunset)}
          </Text>
        </View>
      </View>

      <View>
        <Image
          source={House}
          className="object-fit m-[2%] "
          style={{ height: 150, width: 200 }}></Image>
      </View>

      {/* <HourlyForecast></HourlyForecast> */}
    </>
  );
}

// https://api.openweathermap.org/data/2.5/weather?lat=30.3525997&lon=78.0191896&appid=eb2afa1fdab203f1c97ade85de93dd03

const lat = 30.3525997;
const lon = 78.0191896;
const API_KEY = 'eb2afa1fdab203f1c97ade85de93dd03';

const threeHourData = [
  { temp: '19C', weather: 'cloudy', time: '15:00' },
  { temp: '21C', weather: 'clear', time: '18:00' },
  { temp: '15C', weather: 'haze', time: '21:00' },
  { temp: '10C', weather: 'cloudy', time: '24:00' },
  { temp: '9C', weather: 'fog', time: '03:00' },
];

// 🌆 London
// const lat = 51.5072;
// const lon = -0.1276;

// // 🌆 Oslo
// const lat = 59.9139;
// const lon = 10.7522;

// // 🌆 Cape Town
// const lat = -33.9249;
// const lon = 18.4241;

// // 🌆 Sydney
// const lat = -33.8688;
// const lon = 151.2093;
