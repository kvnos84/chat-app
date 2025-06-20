// StartScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ImageBackground
} from 'react-native';

// List of background color options
const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

export default function StartScreen({ navigation }) {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState(colors[0]);

  return (
    <ImageBackground
      source={require('../assets/images/BackgroundImage.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.container]}>
        <Text style={styles.title}>Chatter Box</Text>

        <View style={styles.box}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="rgba(117, 112, 131, 0.5)"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.chooseColorLabel}>Choose Background Color:</Text>
            <View style={styles.colorOptions}>
              {colors.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setBgColor(color)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    bgColor === color && styles.colorSelected,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ChatScreen', {
                  name: name,
                  bgColor: bgColor,
                })
              }
            >
              <Text style={styles.buttonText}>Chat Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  box: {
    backgroundColor: '#FFFFFF',
    width: '88%',
    paddingVertical: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  formContainer: {
    width: '88%',
    gap: 20,
  },
  input: {
    height: 50,
    borderColor: '#757083',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  chooseColorLabel: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    alignSelf: 'flex-start',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: '#000',
  },
  button: {
    backgroundColor: '#757083',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
