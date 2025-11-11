import { View, Text, Image, ActivityIndicator, FlatList } from 'react-native';

import House from './../../assets/weather/House.jpg';
import weatherPic from './../../assets/weather/weatherPic.jpg';
import { useContext, useEffect, useState } from 'react';
import Error from '../Utils/Error';
import { convertTime } from '../Utils/helperFunctions/convertTime';
import HourlyForecast from './HourlyForecast';
import * as Location from 'expo-location';
import { UnitContext } from '../../app/_layout';

// calling the weather API here
export default function RenderWeather({ weatherData, setWeatherData, savedUserLocation }) {
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState('');

  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setlocationErrorMsg] = useState('');

  const { preferredUnit, setPreferredUnit } = useContext(UnitContext);

  // const [savedLocations,setSavedLocations]=useState(null)

  useEffect(() => {
    console.log('User unit prefrence changed:', preferredUnit);
  }, [preferredUnit]);

  //1-fetch the user default location, through newtork or gps(permission needed)
  useEffect(() => {
    async function getUserLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

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
        } catch (error) {
          setlocationErrorMsg('Permission to access location was denied', error.message);
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
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=${preferredUnit}`
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
  }, [location, preferredUnit, apiKey]);

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
  const { preferredUnit, setPreferredUnit } = useContext(UnitContext);

  return (
    <>
      <View className="w-full rounded-2xl  p-6 ">
        {/* Temperature & Condition */}
        <View className="mb-6 flex-col items-center justify-center">
          <Text className="text-5xl font-bold text-white">
            {Math.round(weatherData?.main?.temp)}
            {preferredUnit === 'standard' ? ' F' : '° C'}
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

const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
