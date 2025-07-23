// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import ScanScreen from './components/ScanScreen';
import PrintScreen from './components/PrintScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Print" component={PrintScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
