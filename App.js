// App.js
import React, { useEffect, useState, createContext } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';

// Screens
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

// Firebase config
import { firebaseConfig } from './firebaseConfig'; // Adjust path if needed

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Context to share Firestore db and connectivity status
export const FirebaseContext = createContext(null);

const Stack = createNativeStackNavigator();

export default function App() {
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    if (netInfo.isConnected != null) {
      setIsConnected(netInfo.isConnected);

      if (netInfo.isConnected) {
        enableNetwork(db)
          .then(() => console.log('Firestore network enabled'))
          .catch((err) => console.log('Enable network error:', err));
      } else {
        disableNetwork(db)
          .then(() => console.log('Firestore network disabled'))
          .catch((err) => console.log('Disable network error:', err));
      }
    }
  }, [netInfo.isConnected]);

  return (
    <FirebaseContext.Provider value={{ db, isConnected }}>
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
    </FirebaseContext.Provider>
  );
}
