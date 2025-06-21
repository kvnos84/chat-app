// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

// Import Firestore db from your firebase.js
import { db } from './firebase';

const Stack = createNativeStackNavigator();

// Create a context to share Firebase db
export const FirebaseContext = React.createContext(null);

export default function App() {
  return (
    <FirebaseContext.Provider value={{ db }}>
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
