import globalStyles from '../../styles'
import React, { useState } from 'react';
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


import { useAuth } from '../../LogContext';
import { useHeaderHeight } from '@react-navigation/elements';

const SettingScreen = ({ route }) => {
  const [selectedSetting, setSelectedSetting] = useState('default');
  const [isAB, setIsAB] = useState(false); // state to control the switch (on/off)
  const headerHeight = useHeaderHeight();
  const { setIsLoggedIn, setUsername, setFavData, setErrorMessage, setDesignSystemData, setSelectedElements } = useAuth();
  console.log(selectedSetting);




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
  }
   



  // Handle toggle switch change
  const toggleSwitch = () => setIsAB((previousState) => !previousState);

  const renderBackButton = () => (
    <View style={{ position: 'absolute', top: 20, left: 10 }}>
      <Pressable onPress={() => setSelectedSetting('default')}>
        <MaterialIcons name="arrow-back-ios" size={30} color="orange" />
      </Pressable>
    </View>
  );



  const [feedbackData, setFeedbackData] = useState({
    subject: [],
    message: [],
  })

  const submitFeedback = () =>{
      // fetch to the backend and create a spot in the database that stores users feedback so i can read it.

  }

  //so the only props that should be passed is navigation and route and whatever initial params you send get attached to the route

  return (
 
   
        <View style={{flex: 1, position: 'relative', alignItems: 'center', zIndex: 0}}>
               <VideoBackground pointerEvents="none" source={require('../../assets/gradient5.mp4')} />
          
               <View style={{ flex: 1, zIndex: 1 }}>
        <ScrollView   
                  contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20}}
                  keyboardShouldPersistTaps="handled"
          >
      {selectedSetting === 'default' && (
        <View>
         <View style={[{ alignItems: 'center', marginTop: 25 }]}>
           <MaterialIcons style={globalStyles.screenStyles.iconShadow} name="settings" size={65} color="royalblue" />
        </View>
          <View style={globalStyles.screenStyles.column}>
            <Pressable onPress={() => setSelectedSetting('account')} style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Account</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSetting('notifications')} style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Notifications</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSetting('privacy')} style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Privacy & Security</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSetting('help')} style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Help & Support</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSetting('about')} style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>About</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedSetting('contact')} style={globalStyles.screenStyles.settingsComp}>
              <Text style={globalStyles.screenStyles.topicText}>Contact Us</Text>
            </Pressable>
          </View>
        </View>
      )}
      {selectedSetting !== 'default' && (
         <View >
          {renderBackButton()}
          {selectedSetting === 'account' && (
            <View style={globalStyles.screenStyles.column}>
              <Pressable onPress={logout} style={globalStyles.screenStyles.settingsComp}>
                <Text style={globalStyles.screenStyles.topicText}>Log Out</Text>
              </Pressable>
            </View>
          )}
          {selectedSetting === 'notifications' && (
          <View style={globalStyles.screenStyles.column}>
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>

               <Text style={[globalStyles.screenStyles.text, { marginRight: 10 }]}>Enable Notifications</Text>
              <Switch
                trackColor={{ false: 'white', true: 'orange' }}
                thumbColor={isAB ? 'white' : 'white'}
                onValueChange={toggleSwitch}
                value={isAB}
        
              />
             </View>
            </View>
          )}
          {selectedSetting === 'privacy' && (
            <View style={globalStyles.screenStyles.column}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
                <Text style={[globalStyles.screenStyles.text, { marginRight: 10 }]}>Allow Synthesis to use your data for research purposes</Text>
                  <Switch
                    trackColor={{ false: 'white', true: 'orange' }}
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
               <View style={[globalStyles.screenStyles.column, { alignItems: 'center' }]}>
                   <Image
                    source={require('../../assets/logo2.png')}  // Adjust according to your directory structure
                    style={{ width: 200, height: 200 }}
                    />
              <Text style={[globalStyles.screenStyles.text, { marginBottom: 10 }]}>
                About Synthesis
              </Text>
              <Text style={[globalStyles.screenStyles.text, { marginBottom: 10 }]}>
                Synthesis is a comprehensive design system app that offers pre-packaged design systems and the tools to create your own. It provides a curated collection of fonts, gradients, typography, hierarchy, icons, and more, allowing you to customize your designs with ease. Whether you’re an experienced designer or just getting started, Synthesis helps you streamline the design process by providing essential tools and recommendations to create visually appealing and consistent design systems.
              </Text>
              <Text style={[globalStyles.screenStyles.text, { marginBottom: 10 }]}>
                Built using React Native, Android Studio, Expo, Node.js, and Firebase, Synthesis leverages the latest technologies to offer a seamless and intuitive user experience. As a fullstack software developer, I’ve crafted this app to not only simplify design but also empower developers and designers alike to create and implement their own unique design systems.
              </Text>
            </View>
          )}
          {selectedSetting === 'contact' && (
                 <View style={[globalStyles.screenStyles.column, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={globalStyles.screenStyles.text}>Contact Us</Text>
       
                   
                 <TextInput
                   style={[globalStyles.screenStyles.input, { marginBottom: 10}]}
                   placeholder="Subject"
                  placeholderTextColor="gray"
                 />

          
           <TextInput
             style={[
             globalStyles.screenStyles.input,
             { 
               marginBottom: 10, 
               height: 120, // Explicitly set height for larger box
               textAlignVertical: 'top', // Ensures text starts at the top-left
               padding: 10 // Adds padding inside the input box
             }
                  ]}
                  placeholder="Your Message"
                  placeholderTextColor="gray"
                  multiline
                  numberOfLines={4}
                />

                 <Pressable onPress={submitFeedback} style={[globalStyles.screenStyles.viewBtn]}>
                     <Text>
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