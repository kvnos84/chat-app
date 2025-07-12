# Chat App with Offline & Media Support

A React Native chat app built using Expo, Firebase, and GiftedChat. This project includes offline message storage, image sharing, and geolocation features.

## 📦 Features

- Real-time chat with Firebase Firestore
- Offline message caching with AsyncStorage
- Share images from gallery or camera
- Share current location with a map bubble
- Accessible ActionSheet for media options

### Set Up Firebase

Firebase config is already initialized in `firebase.js`.

If you fork or clone this repo:

- Create your own Firebase project
- Replace the values in `firebase.js` with your own Firebase project config from the Firebase Console

## ⚙️ Prerequisites

Before running the project, you need:

- **Node.js** (v18+ recommended)
- **Expo CLI**:
  ```bash
  npm install -g expo-cli
  ```

## 📂 Libraries Used

bash
Copy
Edit
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install firebase
npm install react-native-gifted-chat
npm install expo-image-picker
npm install expo-location
npm install react-native-maps

## 🧪 Offline Testing

To test offline mode:

bash
Copy
Edit
expo start --offline
Then toggle your device’s network connection.
