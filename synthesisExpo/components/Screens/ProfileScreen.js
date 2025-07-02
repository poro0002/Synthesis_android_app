import globalStyles from '../../styles';
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import VideoBackground from './Bkgd/VideoBackground'; 
import { ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';


import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL;

const ProfileScreen = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const headerHeight = useHeaderHeight();

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

// ----------------------------------------------------< Fetch Stored Profile Picture >--------------------------------------------------------

// When you fetch the profilePicture from Firestore, it will be this download URL which you can safely load on any device/app reload.



// ----------------------------------------------------< Upload Profile Picture >--------------------------------------------------------


// This function  uploads the image binary and generates a public (or authenticated) download URL.
// 	•	You save this URL (e.g., https://firebasestorage.googleapis.com/....) in Firestore as profilePicture.



// Then you need to:
// 	1.	Upload the image file to something like Firebase Storage,
// 	2.	Store the download URL in a Firestore document under the user’s ID,
// 	3.	Fetch it when rendering the profile screen.




// ----------------------------------------------------< Returned JSX >--------------------------------------------------------


  return (

    <View style={{flex: 1, position: 'relative', alignItems: 'center', zIndex: 0}}>
        
           <ImageBackground
                  source={require('../../assets/pink-gradient.png')}
                  resizeMode="cover"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 0,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.4)', // adjust opacity and color here
                    }}
                  />
              </ImageBackground>

    <View style={{ flex: 1, zIndex: 1, }}>

       <View style={[{ alignItems:'center', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20}]}>
     
             <View style={{}}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                ) : (
                  <LottieView
                     source={require('../../assets/animation3.json')}
                     autoPlay
                     loop
                     style={{ width: 100, height: 100, alignSelf: 'center'}}
                  />
                )}
              </View>
          
               <Pressable style={[{backgroundColor: "royalblue", padding: 10, borderRadius: 5,}]}>
                  <Text style={{color: 'white'}}>
                      Upload Profile Picture
                  </Text>
               </Pressable>
           
           
           <Text style={globalStyles.screenStyles.text}>Username: {username || 'Not set'}</Text>
           <Text style={globalStyles.screenStyles.text}>Email: {email || 'Not set'}</Text>

             <View>
                <Pressable onPress={() => handlePassChange('pass')} style={globalStyles.screenStyles.settingsComp}>
                    <MaterialIcons name="lock" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={globalStyles.screenStyles.topicText}>Change Password</Text>
                </Pressable>

                <Pressable onPress={() => handleUsernameChange('user')} style={globalStyles.screenStyles.settingsComp}>
                    <MaterialIcons name="edit" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={globalStyles.screenStyles.topicText}>Change Username</Text>
                </Pressable>

                <Pressable style={globalStyles.screenStyles.settingsComp}>
                    <MaterialIcons name="link" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={globalStyles.screenStyles.topicText}>Connect</Text>
                </Pressable>
            </View>
       </View>
      </View>
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