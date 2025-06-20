import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons'; // Icon for the button

export default function ChatScreen({ route }) {
  const { name, bgColor } = route.params || {};
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  setMessages([
    {
      _id: 1,
      text: `You have entered Chatter Box.`,
      createdAt: new Date(),
      system: true,
    },
    {
      _id: 2,
      text: 'Hey! Awesome to be here.',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: name || 'You',
      },
    },
  ]);
}, []);

  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  // 🗨️ Custom bubble rendering
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#FFF',
          },
        }}
        textStyle={{
          right: {
            color: '#FFF',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  // ➕ Custom action button with accessibility
  const renderActions = (props) => {
    const onPress = () => {
      console.log('More options pressed');
      // Add your image or geolocation logic here
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
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      renderActions={renderActions}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
