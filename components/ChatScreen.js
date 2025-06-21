import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  Linking,
  Text,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';

import { FirebaseContext } from '../App';
import ActionSheet from 'react-native-actionsheet';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';

import CustomActions from './CustomActions';

import MapView, { Marker } from 'react-native-maps';  // <-- Added import

const storage = getStorage();

export default function ChatScreen({ route }) {
  const { name, bgColor, uid } = route.params || {};
  const { db, isConnected } = useContext(FirebaseContext);
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, 'messages');

  // Cache messages locally
  const cacheMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(msgs));
    } catch (err) {
      console.log('Error caching messages:', err);
    }
  };

  // Load cached messages
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

    if (isConnected === true) {
      const q = query(messagesRef, orderBy('createdAt', 'desc'));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected]);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];

    try {
      await addDoc(messagesRef, {
        text: message.text,
        createdAt: new Date(),
        user: {
          _id: uid,
          name: name || 'You',
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [messagesRef, uid, name]);

  async function uploadImage(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  const actionSheetOptions = [
    'Choose From Library',
    'Take Photo',
    'Send Location',
    'Cancel',
  ];

  let actionSheetRef = null;

  const showActionSheet = () => {
    if (actionSheetRef) {
      actionSheetRef.show();
    }
  };

  const sendImageMessage = async (imageUri) => {
    try {
      await addDoc(messagesRef, {
        image: imageUri,
        createdAt: new Date(),
        user: {
          _id: uid,
          name: name || 'You',
        },
      });
    } catch (error) {
      console.error('Error sending image message:', error);
    }
  };

  const sendLocationMessage = async (latitude, longitude) => {
    try {
      await addDoc(messagesRef, {
        location: {
          latitude,
          longitude,
        },
        createdAt: new Date(),
        user: {
          _id: uid,
          name: name || 'You',
        },
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

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(imageUri);
      if (uploadedUrl) {
        sendImageMessage(uploadedUrl);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(imageUri);
      if (uploadedUrl) {
        sendImageMessage(uploadedUrl);
      }
    }
  };

  const sendLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location is required!');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      const { latitude, longitude } = location.coords;
      sendLocationMessage(latitude, longitude);
    }
  };

  const onActionSheetSelect = (index) => {
    switch (index) {
      case 0:
        pickImage();
        break;
      case 1:
        takePhoto();
        break;
      case 2:
        sendLocation();
        break;
      default:
        break;
    }
  };

  const renderActions = (props) => {
    return (
      <CustomActions
        {...props}
        pickImage={pickImage}
        takePhoto={takePhoto}
        shareLocation={sendLocation}
      />
    );
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

  // Updated renderCustomView to render MapView if location exists
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
    if (isConnected) {
      return <InputToolbar {...props} />;
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor || '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: uid, name: name || 'You' }}
        renderBubble={renderBubble}
        renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}  // MapView will show here
        renderUsernameOnMessage={true}
        isTyping={false}
        showUserAvatar={true}
        alwaysShowSend={true}
        platform={Platform.OS}
      />
      <ActionSheet
        ref={(o) => (actionSheetRef = o)}
        options={actionSheetOptions}
        cancelButtonIndex={3}
        onPress={onActionSheetSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
