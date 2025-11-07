import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

// Screens
import NewHomeScreen from '../screens/NewHomeScreen';
import TimerScreen from '../screens/TimerScreen';
import StatsScreen from '../screens/StatsScreen';
import NewSettingsScreen from '../screens/NewSettingsScreen';
import NewExerciseCatalogScreen from '../screens/NewExerciseCatalogScreen';
import NewExerciseDetailScreen from '../screens/NewExerciseDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: AppTheme.colors.background },
      }}
    >
      <Stack.Screen name="HomeMain" component={NewHomeScreen} />
      <Stack.Screen name="Timer" component={TimerScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="Settings" component={NewSettingsScreen} />
      <Stack.Screen name="Exercises" component={NewExerciseCatalogScreen} />
      <Stack.Screen name="ExerciseDetail" component={NewExerciseDetailScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: AppTheme.colors.background,
          borderTopColor: AppTheme.colors.backgroundCard,
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: AppTheme.colors.primary,
        tabBarInactiveTintColor: AppTheme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TimerTab') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'StatsTab') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="TimerTab"
        component={TimerScreen}
        options={{ tabBarLabel: 'Timer' }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{ tabBarLabel: 'Stats' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={NewSettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
