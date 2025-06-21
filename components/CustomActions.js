import React, { useRef } from 'react';
import {
  ActionSheetIOS,
  Platform,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

const options = [
  'Select an image from library',
  'Take a photo',
  'Share location',
  'Cancel',
];
const CANCEL_INDEX = 3;

export default function CustomActions(props) {
  const actionSheetRef = useRef();

  const onActionPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: CANCEL_INDEX,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              props.pickImage();
              break;
            case 1:
              props.takePhoto();
              break;
            case 2:
              props.shareLocation();
              break;
            default:
              break;
          }
        }
      );
    } else {
      // Show ActionSheet for Android using the react-native-actionsheet library
      actionSheetRef.current.show();
    }
  };

  const onActionSheetSelect = (index) => {
    switch (index) {
      case 0:
        props.pickImage();
        break;
      case 1:
        props.takePhoto();
        break;
      case 2:
        props.shareLocation();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Opens a menu to select an image, take a photo, or share your location"
        onPress={onActionPress}
        style={{ marginLeft: 10 }}
      >
        <View>
          <Text style={{ fontSize: 24, color: '#007AFF' }}>+</Text>
        </View>
      </TouchableOpacity>

      {Platform.OS !== 'ios' && (
        <ActionSheet
          ref={actionSheetRef}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={onActionSheetSelect}
        />
      )}
    </>
  );
}
