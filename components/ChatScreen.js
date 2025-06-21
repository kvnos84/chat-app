import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseContext } from '../App';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

export default function ChatScreen({ route }) {
  const { name, bgColor, uid } = route.params || {};
  const { db } = useContext(FirebaseContext); // get Firestore db from context
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    // Listen for real-time updates from Firestore, ordered newest first
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => {
        const firebaseData = doc.data();

        return {
          _id: doc.id,
          text: firebaseData.text,
          createdAt: firebaseData.createdAt?.toDate?.() || new Date(),
          user: firebaseData.user,
        };
      });

      setMessages(loadedMessages);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [db]);

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
      console.error("Error sending message: ", error);
    }
  }, [messagesRef, name]);

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

  const renderActions = () => {
    const onPress = () => {
      console.log('More options pressed');
      // Future feature: send images, location, etc.
    };

    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        onPress={onPress}
      >
        <View style={{ padding: 10 }}>
          <Ionicons name="add-circle-outline" size={28} color="gray" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor || '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: uid,
          name: name || 'You',
        }}
        renderBubble={renderBubble}
        renderActions={renderActions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
