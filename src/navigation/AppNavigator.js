import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutGeneratorScreen from '../screens/WorkoutGeneratorScreen';
import WorkoutSessionScreen from '../screens/WorkoutSessionScreen';
import WorkoutCompleteScreen from '../screens/WorkoutCompleteScreen';
import ExerciseCatalogScreen from '../screens/ExerciseCatalogScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Tab Navigator - Navegación principal con tabs
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f3460',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🏠" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ExerciseCatalog"
        component={ExerciseCatalogScreen}
        options={{
          tabBarLabel: 'Ejercicios',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📚" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WorkoutHistory"
        component={WorkoutHistoryScreen}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📊" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progreso',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📈" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="⚙️" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Componente auxiliar para íconos de tabs
 */
function TabIcon({ emoji, color }) {
  return (
    <Text style={{ fontSize: 24, opacity: color === '#0f3460' ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

/**
 * Stack Navigator - Navegación principal con stack
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main Tabs */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        {/* Workout Flow */}
        <Stack.Screen
          name="WorkoutGenerator"
          component={WorkoutGeneratorScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="WorkoutSession"
          component={WorkoutSessionScreen}
          options={{
            gestureEnabled: false, // Prevenir deslizar para cerrar
          }}
        />
        <Stack.Screen
          name="WorkoutComplete"
          component={WorkoutCompleteScreen}
          options={{
            gestureEnabled: false,
          }}
        />

        {/* Exercise Detail */}
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
