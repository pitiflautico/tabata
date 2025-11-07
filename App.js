import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
import { CustomAlertComponent } from './src/components/CustomAlert';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <MainNavigator />
          <StatusBar style="light" />
          <CustomAlertComponent />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
