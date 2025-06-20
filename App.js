// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your new screens
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen 
          name="StartScreen" 
          component={StartScreen} 
          options={{ title: 'Welcome' }} 
        />
        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

