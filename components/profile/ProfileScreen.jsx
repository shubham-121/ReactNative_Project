import { View, Text, Switch } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { UnitContext, ThemeContext } from '../../app/_layout';
import SavedLocationsCardList from '../Utils/SavedLocationsCardList';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className=" gap-4   px-4 py-4">
        <UserFeatures />
        <AppTheme />
      </View>

      <SavedLocationsCardList />
    </View>
  );
}

function UserFeatures() {
  const { preferredUnit, setPreferredUnit } = useContext(UnitContext);

  useEffect(() => {
    console.log('Temperature preference changed:', preferredUnit);
  }, [preferredUnit]);

  return (
    <View className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
      <Text className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Temperature Unit
      </Text>
      <View className="flex-row items-center justify-center space-x-4">
        <Text className="text-base text-gray-700 dark:text-gray-200">°F</Text>
        <Switch
          value={preferredUnit === 'metric'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={preferredUnit ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() =>
            setPreferredUnit((prev) => (prev === 'metric' ? 'standard' : 'metric'))
          }
        />
        <Text className="text-base text-gray-700 dark:text-gray-200">°C</Text>
      </View>
    </View>
  );
}

function AppTheme() {
  const { deviceThemeMode, setdeviceThemeMode } = useContext(ThemeContext);

  useEffect(() => {
    console.log('Device theme changed:', deviceThemeMode);
  }, [deviceThemeMode]);

  return (
    <View className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
      <Text className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">App Theme</Text>
      <View className="flex-row items-center justify-center space-x-4">
        <Text className="text-base text-gray-700 dark:text-gray-200">Dark</Text>
        <Switch
          value={deviceThemeMode === 'light'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={deviceThemeMode ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => setdeviceThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
        />
        <Text className="text-base text-gray-700 dark:text-gray-200">Light</Text>
      </View>
    </View>
  );
}

//Preferred temperature unit (°C / °F)

// Preferred theme (light/dark)

//render the user saved locations here

//user current location details
