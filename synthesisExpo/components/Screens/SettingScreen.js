import globalStyles from '../../styles'
import React, { useEffect, useState } from 'react';
import {
  View, // A container that supports layout with flexbox
  Text, // For displaying text
  TextInput, // For user input text fields
  StyleSheet, // For creating styles similar to CSS
  ScrollView, // Enables scrolling for content that may exceed the screen height
  SectionList, // For rendering a list with grouped data, like a <ul> with <li> 's'
  Image, // For displaying images from local or remote sources
  Modal, // For presenting content over the current view (like alerts or dialogs)
  Picker, // A dropdown component for selecting options <select> <option>
  ActivityIndicator, // For showing loading indicators during asynchronous tasks
  Switch, // A toggle component for binary options (on/off)
  Pressable // Import Pressable for user interactions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DevSettings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoBackground from './Bkgd/VideoBackground'; 
import { ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';



import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL;
import { useAuth } from '../../LogContext';
import { useHeaderHeight } from '@react-navigation/elements';

const SettingScreen = ({ route }) => {
  const [selectedSetting, setSelectedSetting] = useState('default');
  const [isAB, setIsAB] = useState(false); // state to control the switch (on/off)
  const headerHeight = useHeaderHeight();
  const { setIsLoggedIn, setUsername, username, setFavData, setErrorMessage, errorMessage, setDesignSystemData, setSelectedElements, checkLogin } = useAuth();
 


  const [feedbackData, setFeedbackData] = useState({
    subject: [],
    message: [],
    username: username
  })

useEffect(() => {
    setErrorMessage("");
}, [selectedSetting]); 

      const handleInputChange = (property, value) => {
          console.log("Updated feedbackData:", feedbackData);
          setFeedbackData(prev => ({ ...prev, [property]: value })); // matches the coro property and updates the value on change 
      };



  const submitFeedback = async () => {


    console.log('submitFeedback btn pressed')
     
       const fetchURL = `${apiUrl}/contact`;
       const fetchHeaders = new Headers({'Content-Type': 'application/json'});

      const fetchOptions = {
         method: "POST",
         headers: fetchHeaders,
         mode: 'cors',
         body: JSON.stringify({
          subject: feedbackData.subject,
          message: feedbackData.message,
          username: username,
        })
      }

     try{

      let response = await fetch(fetchURL, fetchOptions);

      let data = await response.json();
      console.log('data:', data)

      if(data.success){
        setErrorMessage(data.message)
        setFeedbackData({    
          subject: [],
          message: [],
          username: username}) 
        setErrorMessage(data.message)
        console.log('errorMessage set to:', data.message);
      } else{
         setErrorMessage(data.message)
        console.log('errorMessage set to:', data.message);
      }



      }catch(err){
          console.log("there was an error with the fetch", err)
      }

  }




  const logout = async () => {
    console.log('logging out')
  
    await AsyncStorage.clear();
  
    await AsyncStorage.removeItem('username');
    setUsername(null);
    setIsLoggedIn(false);
    setFavData([]);
    setErrorMessage("");
    setDesignSystemData([]);
    setSelectedElements({
      fonts: [],
      gradients: [],
      typography: [],
      icons: [],
      comp: [],
      name: [],
      about: [],
    });
    setTimeout(() => checkLogin(), 200);
    
  }
   



  // Handle toggle switch change
  const toggleSwitch = () => setIsAB((previousState) => !previousState);

  const renderBackButton = () => (
    <View style={{ position: 'absolute', top: 20, left: 10, zIndex: 1 }}>
      <Pressable onPress={() => setSelectedSetting('default')}>
        <MaterialIcons name="arrow-back-ios" size={30} color="royalblue" />
      </Pressable>
    </View>
  );





  //so the only props that should be passed is navigation and route and whatever initial params you send get attached to the route

  return (
 
   
        <View style={{flex: 1, position: 'relative',  zIndex: 0}}>
          <ImageBackground
                   source={require('../../assets/blue-orange-gradient.jpg')}
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
          
    <View style={{ flex: 1, zIndex: 1 }}>
        <ScrollView   
                  contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20}}
                  keyboardShouldPersistTaps="handled"
          >
      {selectedSetting === 'default' && (
        <View>
         <View style={[{ alignItems: 'center', marginTop: 25 }]}>
            <LottieView
                source={require('../../assets/animation7.json')}
                autoPlay
                loop
                style={{ width: 120, height: 120, alignSelf: 'center'}}
              />
        </View>
        
        <View style={{ marginTop: 30 }}>
              <Pressable onPress={() => setSelectedSetting('account')} style={globalStyles.screenStyles.settingsComp}>
                  <MaterialIcons name="person" size={24} color="white" style={[globalStyles.screenStyles.iconShadow, { marginRight: 15, }]} />
                  <Text style={globalStyles.screenStyles.topicText}>Account</Text>
              </Pressable>

              <Pressable onPress={() => setSelectedSetting('notifications')} style={globalStyles.screenStyles.settingsComp}>
                  <MaterialIcons name="notifications" size={24} color="white"  style={[globalStyles.screenStyles.iconShadow, { marginRight: 15, }]} />
                  <Text style={globalStyles.screenStyles.topicText}>Notifications</Text>
              </Pressable>

              <Pressable onPress={() => setSelectedSetting('help')} style={globalStyles.screenStyles.settingsComp}>
                  <MaterialIcons name="help-outline" size={24} color="white"  style={[globalStyles.screenStyles.iconShadow, { marginRight: 15, }]}/>
                  <Text style={globalStyles.screenStyles.topicText}>Help & Support</Text>
              </Pressable>

              <Pressable onPress={() => setSelectedSetting('about')} style={globalStyles.screenStyles.settingsComp}>
                  <MaterialIcons name="info-outline" size={24} color="white"  style={[globalStyles.screenStyles.iconShadow, { marginRight: 15, }]} />
                  <Text style={globalStyles.screenStyles.topicText}>About</Text>
              </Pressable>

              <Pressable onPress={() => setSelectedSetting('contact')} style={globalStyles.screenStyles.settingsComp}>
                  <MaterialIcons name="email" size={24} color="white"  style={[globalStyles.screenStyles.iconShadow, { marginRight: 15, }]}/>
                  <Text style={globalStyles.screenStyles.topicText}>Contact Me</Text>
              </Pressable>
          </View>

        </View>
      )}
      {selectedSetting !== 'default' && (
         <View >
          {renderBackButton()}
          {selectedSetting === 'account' && (
            <View style={globalStyles.screenStyles.column}>
              <Pressable onPress={logout} style={[globalStyles.screenStyles.settingsComp, {backgroundColor: 'red'}]}>
                <Text style={globalStyles.screenStyles.topicText}>Log Out</Text>
              </Pressable>
            </View>
          )}
          {selectedSetting === 'notifications' && (
          <View style={globalStyles.screenStyles.column}>
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>

               <Text style={[globalStyles.screenStyles.text, { marginRight: 10 }]}>Enable Notifications</Text>
              <Switch
                trackColor={{ false: 'white', true: 'royalblue' }}
                thumbColor={isAB ? 'white' : 'white'}
                onValueChange={toggleSwitch}
                value={isAB}
        
              />
             </View>
            </View>
          )}
          {selectedSetting === 'help' && (
              <View style={[globalStyles.screenStyles.column, { alignItems: 'center' }]}>
                 <Pressable  style={globalStyles.screenStyles.settingsComp}>
                <Text style={globalStyles.screenStyles.topicText}>Insert Help files here</Text>
              </Pressable>
               </View>
          )}
          {selectedSetting === 'about' && (
              
                  <ScrollView 
                    vertical // Enables horizontal scrolling
                    showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                    contentContainerStyle={[globalStyles.screenStyles.column,  { alignItems: 'center', marginBottom: 50, marginTop: 50 }]} 
                    >
              
                 <Image
                    source={require('../../assets/logo2.png')}  // Adjust according to your directory structure
                    style={[globalStyles.screenStyles.logoShadow, { width: 200, height: 200, }]}
                    
                    />
                  
             
                  
              <Text style={{marginBottom: 25, marginTop: 25, fontSize: 18, fontWeight: 'bold', color: 'white',  }}>
                Synthesis
              </Text>
              <Text style={ { marginBottom: 10, fontSize: 14, fontStyle: 'italic', color: 'white', textAlign: 'center' }}>
                Synthesis is a comprehensive design system app that offers pre-packaged design systems and the tools to create your own. It provides a curated collection of fonts, gradients, typography, hierarchy, icons, and more, allowing you to customize your designs with ease. Whether you’re an experienced designer or just getting started, Synthesis helps you streamline the design process by providing essential tools and recommendations to create visually appealing and consistent design systems.
              </Text>
              <Text style={{ marginBottom: 10, fontSize: 14, fontStyle: 'italic', color: 'white', textAlign: 'center' }}>
                Built using React Native, Android Studio, Expo, Node.js, and Firebase, Synthesis leverages the latest technologies to offer a seamless and intuitive user experience. As a fullstack software developer, I’ve crafted this app to not only simplify design but also empower developers and designers alike to create and implement their own unique design systems.
              </Text>
        </ScrollView>
          )}
          {selectedSetting === 'contact' && (
                 <View style={[globalStyles.screenStyles.column, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={[globalStyles.screenStyles.text, {marginBottom: 10, fontWeight: 'bold'}]}>How Can I Improve ?</Text>
                     {errorMessage &&
                      <Text style={[globalStyles.screenStyles.textShadow, { color: 'orange', textAlign: 'center', marginVertical: 10 }]}>{errorMessage}</Text>
                     }
       
                   
                 <TextInput
                   style={[globalStyles.screenStyles.input, { 
                    marginBottom: 10, 
                    width: '85%', 
                    borderColor: 'white', 
                 
                  }]}
                    placeholder="Subject"
                    placeholderTextColor="gray"
                    value={feedbackData.subject}
                    onChangeText={(value) => handleInputChange('subject', value)}
                 />

          
           <TextInput
             style={[
                   globalStyles.screenStyles.input,
                   { 
                     marginBottom: 10, 
                     height: 120, 
                     textAlignVertical: 'top', 
                     padding: 10,
                     width: '85%', 
                     borderColor: 'white', 
                   }
                  ]}
                  placeholder="Your Message"
                  placeholderTextColor="gray"
                  multiline
                  numberOfLines={4}
                  value={feedbackData.message}
                  onChangeText={(value) => handleInputChange('message', value)}
                />

               <Pressable onPress={submitFeedback}  
                 style={{ 
                    marginTop: 10,
                    backgroundColor: 'royalblue',
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    width: '85%'
                  }} 
                    >
                     <Text style={{color: 'white'}}>
                        Submit Feedback
                     </Text>
                  </Pressable>
               </View>
          )}
        </View>
      )}

       </ScrollView>
    </View>
    </View>
 
  );
};

export default SettingScreen;