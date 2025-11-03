import { View, Text, Image, ActivityIndicator } from 'react-native';

import House from './../../assets/weather/House.jpg';
import weatherPic from './../../assets/weather/weatherPic.jpg';
import { useEffect, useState } from 'react';
import Error from '../Utils/Error';
import { convertTime } from '../Utils/helperFunctions/convertTime';

// calling the weather API here
export default function RenderWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState('');

  //fetch the weather details
  useEffect(() => {
    setTimeout(() => {
      async function fetchWeatherDetails() {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
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
    }, 5000);
  }, []);

  return (
    <View className="mt-auto  flex-1 items-center">
      <Text className="mb-4 text-center text-4xl font-bold tracking-wide text-sky-600">
        {weatherData?.name}
      </Text>
      <Image source={weatherPic} style={{ width: 100, height: 100, borderRadius: 30 }}></Image>
      {fetchError && <Error fetchErrorMessage={fetchErrorMessage}></Error>}
      {weatherData ? (
        <WeatherDetails weatherData={weatherData} setWeatherData={setWeatherData}></WeatherDetails>
      ) : (
        // <Text>Loading the weather data, please wait.....</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
}

function WeatherDetails({ weatherData, setWeatherData }) {
  return (
    <View className="w-full rounded-2xl bg-white/70 p-6 shadow-lg">
      {/* Temperature & Condition */}
      <View className="mb-6 flex-col items-center justify-center">
        <Text className="text-5xl font-bold text-gray-800">
          {Math.round(weatherData?.main?.temp)}°
        </Text>
        <Text className="text-xl font-medium text-gray-600">{weatherData?.weather[0]?.main}</Text>
      </View>

      {/* Max & Min */}
      <View className="mb-4 flex-row justify-center gap-8">
        <Text className="text-lg font-semibold text-blue-700">
          Max: {Math.ceil(weatherData?.main?.temp_max)}°
        </Text>
        <Text className="text-lg font-semibold text-blue-700">
          Min: {Math.floor(weatherData?.main?.temp_min)}°
        </Text>
      </View>

      {/* Humidity */}
      <Text className="mb-2 text-center text-lg font-semibold text-gray-700">
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
  );
}

// https://api.openweathermap.org/data/2.5/weather?lat=30.3525997&lon=78.0191896&appid=eb2afa1fdab203f1c97ade85de93dd03

const lat = 30.3525997;
const lon = 78.0191896;
const API_KEY = 'eb2afa1fdab203f1c97ade85de93dd03';

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
