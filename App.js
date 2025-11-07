import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
import { CustomAlertComponent, CustomAlert } from './src/components/CustomAlert';

export default function App() {
  const alertRef = useRef(null);

  useEffect(() => {
    // Registrar la referencia del alert para uso global
    if (alertRef.current) {
      CustomAlert.setAlertRef(alertRef.current);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <MainNavigator />
          <StatusBar style="light" />
          <CustomAlertComponent ref={alertRef} />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
