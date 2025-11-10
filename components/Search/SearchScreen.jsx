import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import searchBg from '../../assets/search/searchBg.jpg';
import SearchBar from './SearchBar';
import { darkTheme, lightTheme } from '../Utils/helperFunctions/theme';
import { ThemeContext } from '../../app/_layout';

export default function SearchScreen() {
  const [searchCity, setsearchCity] = useState('');

  const { deviceThemeMode, setdeviceThemeMode } = useContext(ThemeContext);

  return (
    <View className="flex-1">
      <ImageBackground source={searchBg} className="absolute inset-0" resizeMode="cover" />
      {/* Overlay */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor:
            deviceThemeMode === 'light' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)',
        }}
      />
      <SearchBar searchCity={searchCity} setsearchCity={setsearchCity} />
    </View>
  );
}
