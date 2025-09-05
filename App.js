import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LaunchScreen from './src/screens/LaunchScreen';
import RouteSelectionScreen from './src/screens/RouteSelectionScreen';
import BusTrackingScreen from './src/screens/BusTrackingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Launch"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Launch" component={LaunchScreen} />
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="BusTracking" component={BusTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}