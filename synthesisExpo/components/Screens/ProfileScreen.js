
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
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 


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

  console.log('profile screen username:', username)

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


// ----------------------------------------------------< Upload Profile Picture >--------------------------------------------------------


// This function  uploads the image binary and generates a public (or authenticated) download URL.
// 	•	You save this URL (e.g., https://firebasestorage.googleapis.com/....) in Firestore as profilePicture.


const uploadImageAsync = async (uri, userId) => {

  console.log('uploading image...');

  // Convert local file URI to blob
  const response = await fetch(uri);
  const blob = await response.blob();

  const storage = getStorage();
  const storageRef = ref(storage, `profilePictures/${userId}.jpg`);

  // Upload the blob
  await uploadBytes(storageRef, blob);

  // Get the public download URL
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// ----------------------------------------------------< Fetch Stored Profile Picture >--------------------------------------------------------

// When you fetch the profilePicture from Firestore, it will be this download URL which you can safely load on any device/app reload.

const fetchUserProfilePicture = async () => {

  console.log('Fetching profile picture...');

  try {
    const response = await fetch(`${apiUrl}/getPfp`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    console.log('fetchUserProfilePicture:', data.message)

    if (data.success && data.profilePicture) {
      setProfileImage(data.profilePicture);
    }
  } catch (err) {
    console.error('Error fetching profile picture:', err);
  }
};



useEffect(()=>{
  fetchUserProfilePicture()
}, [])




// Then you need to:
// 	1.	Upload the image file to something like Firebase Storage,
// 	2.	Store the download URL in a Firestore document under the user’s ID,
// 	3.	Fetch it when rendering the profile screen.

const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Permission to access photos is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    const localUri = result.assets[0].uri;

    // Upload image to Firebase Storage and get download URL
    const downloadUrl = await uploadImageAsync(localUri, username); // username or uid as filename

    setProfileImage(downloadUrl); // show remote image url

    // Save the download URL to Firestore via your backend
    try {
      const response = await fetch(`${apiUrl}/savePfp`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, profilePicture: downloadUrl }),
      });

      const data = await response.json();
      console.log(data.message)

      if (!data.success) {
        alert('Failed to save profile picture');
      }
    } catch (err) {
      console.error('Error saving profile picture:', err);
    }
  }
};


// ----------------------------------------------------< Returned JSX >--------------------------------------------------------


  return (
    <View style={[globalStyles.screenStyles.container, {alignItems: 'center'}]}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <MaterialIcons name="person" size={100} color="white" />
        )}
      </View>
     <Pressable onPress={pickImage} style={[{backgroundColor: "orange", padding: 10, borderRadius: 5,}]}>
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