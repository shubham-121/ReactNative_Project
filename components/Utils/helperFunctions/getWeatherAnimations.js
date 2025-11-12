import clearsky from '../../../assets/animations/clearsky.json';
import cloudy from '../../../assets/animations/cloudy.json';
import foggy from '../../../assets/animations/foggy.json';
import thunderstorm from '../../../assets/animations/thunderstorm.json';
import drizzle from '../../../assets/animations/drizzle.json';
import rainy from '../../../assets/animations/rainy.json';
import snow from '../../../assets/animations/snow.json';
import defaultWeather from '../../../assets/animations/defaultWeather.json';

export function getWeatherAnimation(id, main) {
  if (id >= 200 && id <= 232) return thunderstorm;
  if (id >= 300 && id <= 321) return drizzle;
  if (id >= 500 && id <= 531) return rainy;
  if (id >= 600 && id <= 622) return snow;
  if (id >= 701 && id <= 781) return foggy;
  if (id === 800) return clearsky;
  if (id >= 801 && id <= 804) return cloudy;

  // fallback (in case API sends something unexpected)
  return defaultWeather;
}
