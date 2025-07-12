// App.js
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { disableNetwork, enableNetwork } from 'firebase/firestore'; // adjust if using a wrapper
import * as React from 'react';
import { db } from './firebase';

// Screens
import ChatScreen from './ChatScreen';
import StartScreen from './StartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const netInfo = useNetInfo();

  React.useEffect(() => {
    if (netInfo.isConnected === false) {
      disableNetwork(db).catch((err) => console.log('Error disabling network:', err));
    } else if (netInfo.isConnected === true) {
      enableNetwork(db).catch((err) => console.log('Error enabling network:', err));
    }
  }, [netInfo.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen 
          name="StartScreen" 
          component={StartScreen} 
          options={{ title: 'Welcome' }} 
        />
        <Stack.Screen name="ChatScreen">
          {props => (
            <ChatScreen 
              {...props} 
              db={db} 
              isConnected={netInfo.isConnected} 
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}