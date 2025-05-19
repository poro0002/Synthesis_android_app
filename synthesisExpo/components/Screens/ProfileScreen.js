
import globalStyles from '../../styles'
import React, { useState, useEffect } from 'react';

import {
  View, // A container that supports layout with flexbox
  Text, // For displaying text
  TouchableOpacity, // A button that responds to user touch with visual feedback
  TextInput, // For user input text fields
  StyleSheet,
  Pressable, // For creating styles similar to CSS
  ScrollView, // Enables scrolling for content that may exceed the screen height
  SectionList, // For rendering a list with grouped data, like a <ul> with <li> 's'
  Image, // For displaying images from local or remote sources
  Modal, // For presenting content over the current view (like alerts or dialogs)
  Picker, // A dropdown component for selecting options <select> <option>
  ActivityIndicator, // For showing loading indicators during asynchronous tasks
  Switch,  // A toggle component for binary options (on/off)
  Button
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native'

 


const ProfileScreen = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedEmail = await AsyncStorage.getItem('email');

      if (storedUsername) setUsername(storedUsername);
      if (storedEmail) setEmail(storedEmail);
    };

    fetchUserData();
  }, []);

// write backend functionality 

// basically you would need to show a password change form when the user prompts it or create another screen within this screen for the process to begin
// then, both pwords input values would have to match to confirm them and push those values to a use state
// also, password rules would have to come into play again so grab those from the app.js
// the change for username or pword will be done in the register endpoint using a type query in the url

const handlePassChange = (type) =>{
  navigation.navigate('AccountChangeScreen', {type})
}



const handleUsernameChange = (type) =>{
  navigation.navigate('AccountChangeScreen', {type})
}




// assets property

// {
//   "assets": [
//     {
//       "uri": "file:///path/to/image.jpg", // The file URI
//       "fileName": "image.jpg",           // The name of the file
//       "type": "image/jpeg",              // The MIME type of the file
//       "width": 1080,                     // The width of the image
//       "height": 1920,                    // The height of the image
//       "fileSize": 123456                 // The size of the file in bytes
//     }
//   ]
// }

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 400,
        maxHeight: 400,
        
      },
     
      (response) => {
        if (response.didCancel) {
          console.log('User closed image picker');
        } else if (response.errorMessage) {
          console.error('Image selection Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setProfileImage(selectedImage.uri);
        }
      }
    );
  };

  return (
    <View style={[globalStyles.screenStyles.container, {alignItems: 'center'}]}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <MaterialIcons name="person" size={100} color="white" />
        )}
      </View>
     <Pressable onPress={pickImage} style={[{backgroundColor: "orange"}]}>
        <Text>
            Upload Profile Picture
        </Text>
     </Pressable>


      {/* Display Username and Email */}
      <Text style={globalStyles.screenStyles.text}>Username: {username || 'Not set'}</Text>
      <Text style={globalStyles.screenStyles.text}>Email: {email || 'Not set'}</Text>

      <Pressable onPress={() => handlePassChange('pass')}  style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Change Password</Text>
      </Pressable>

      <Pressable onPress={() => handleUsernameChange('user')}  style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Change Username</Text>
      </Pressable>

      <Pressable  style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Connect</Text>
      </Pressable>
    </View>
  );
};




const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
});

export default ProfileScreen;