import LottieView from 'lottie-react-native';
import clearsky from '../assets/animations/clearsky.json';
import { useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { getWeatherAnimation } from './Utils/helperFunctions/getWeatherAnimations';

export default function LiveWeather({ weatherType, weatherID }) {
  const animation = useRef(null);
  const weatherAnimation = getWeatherAnimation(weatherID, weatherType);

  return (
    <View style={styles.animationContainer}>
      <View style={styles.lottieWrapper}>
        <LottieView ref={animation} autoPlay loop source={weatherAnimation} style={styles.lottie} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieWrapper: {
    width: 200,
    height: 180,
    borderRadius: 50,
    // overflow: 'hidden', //
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  lottie: {
    width: 180,
    height: 180,
  },
});
