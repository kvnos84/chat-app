// components/Start.js
import { useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const backgroundImage = require('../assets/images/background-image.png');

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('');

  const backgroundColors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Chat App</Text>

        <View style={styles.box}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Your Name"
            placeholderTextColor="#757083"
          />

          <Text style={styles.colorText}>Choose Background Color:</Text>
          <View style={styles.colorOptions}>
            {backgroundColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  bgColor === color ? styles.selected : null,
                ]}
                onPress={() => setBgColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Chat', { name: name || 'User', bgColor })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 60,
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 60,
  },
  input: {
    height: 50,
    borderColor: '#757083',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#757083',
    marginBottom: 20,
    fontWeight: '300',
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#000',
  },
  button: {
    backgroundColor: '#757083',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Start;
