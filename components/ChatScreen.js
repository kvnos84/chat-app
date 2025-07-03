import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import { FirebaseContext } from '../App';
import CustomActions from './CustomActions';

const storage = getStorage();

export default function ChatScreen({ route }) {
  const { name, bgColor, uid } = route.params || {};
  const { db, isConnected } = useContext(FirebaseContext);
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, 'messages');
  const userObj = { _id: uid, name: name || 'You' };

  const cacheMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(msgs));
    } catch (err) {
      console.log('Error caching messages:', err);
    }
  };

  const loadCachedMessages = async () => {
    try {
      const cached = await AsyncStorage.getItem('chatMessages');
      if (cached) {
        setMessages(JSON.parse(cached));
      }
    } catch (err) {
      console.log('Error loading cached messages:', err);
    }
  };

  useEffect(() => {
    let unsubscribe;

    if (isConnected) {
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || '',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            user: data.user,
            image: data.image,
            location: data.location,
          };
        });
        setMessages(loadedMessages);
        cacheMessages(loadedMessages);
      });
    } else {
      loadCachedMessages();
    }

    return () => unsubscribe && unsubscribe();
  }, [isConnected]);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    try {
      await addDoc(messagesRef, {
        text: message.text,
        createdAt: serverTimestamp(),
        user: userObj,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [messagesRef]);

  async function uploadImage(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  const sendImageMessage = async (imageUri) => {
    try {
      await addDoc(messagesRef, {
        image: imageUri,
        createdAt: serverTimestamp(),
        user: userObj,
      });
    } catch (error) {
      console.error('Error sending image message:', error);
    }
  };

  const sendLocationMessage = async (latitude, longitude) => {
    try {
      await addDoc(messagesRef, {
        location: { latitude, longitude },
        createdAt: serverTimestamp(),
        user: userObj,
      });
    } catch (error) {
      console.error('Error sending location message:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photo library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(imageUri);
      if (uploadedUrl) sendImageMessage(uploadedUrl);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(imageUri);
      if (uploadedUrl) sendImageMessage(uploadedUrl);
    }
  };

  const sendLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location is required!');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    sendLocationMessage(latitude, longitude);
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#000' },
        left: { backgroundColor: '#FFF' },
      }}
      textStyle={{
        right: { color: '#FFF' },
        left: { color: '#000' },
      }}
    />
  );

  const renderCustomView = (props) => {
    const { currentMessage } = props;

    if (currentMessage.image) {
      return (
        <Image
          source={{ uri: currentMessage.image }}
          style={{ width: 200, height: 150, borderRadius: 13, margin: 3 }}
        />
      );
    }

    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
            }}
          />
        </MapView>
      );
    }

    return null;
  };

  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  const renderActions = (props) => (
    <CustomActions
      {...props}
      pickImage={pickImage}
      takePhoto={takePhoto}
      shareLocation={sendLocation}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor || '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={userObj}
        renderBubble={renderBubble}
        renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}
        renderUsernameOnMessage={true}
        isTyping={false}
        showUserAvatar={true}
        alwaysShowSend={true}
        platform={Platform.OS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});