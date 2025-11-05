import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import searchBg from '../../assets/search/searchBg.jpg';
import SearchBar from './SearchBar';

export default function SearchScreen() {
  const [searchCity, setsearchCity] = useState('Dehradun');
  return (
    <View className="flex-1 border-2 border-black">
      <ImageBackground source={searchBg} className="absolute inset-0" resizeMode="cover" />

      <SearchBar searchCity={searchCity} setsearchCity={setsearchCity} />
    </View>
  );
}
