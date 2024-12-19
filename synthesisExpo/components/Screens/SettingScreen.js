import globalStyles from '../../styles'
import React, { useState } from 'react';
import { View, Text, Pressable, Switch, Image, Button, TextInput  } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingScreen = ({ route }) => {
  const [selectedSetting, setSelectedSetting] = useState('default');
  const { logout } = route.params; //   here is logout function deconstructed from the params properrty that is in the route 
  console.log(selectedSetting);

  const [isAB, setIsAB] = useState(false); // state to control the switch (on/off)

  // Handle toggle switch change
  const toggleSwitch = () => setIsAB((previousState) => !previousState);

  const renderBackButton = () => (
    <View style={{ position: 'absolute', top: 20, left: 10 }}>
      <Pressable onPress={() => setSelectedSetting('default')}>
        <MaterialIcons name="arrow-back-ios" size={30} color="orange" />
      </Pressable>
    </View>
  );

  //so the only props that should be passed is navigation and route and whatever initial params you send get attached to the route

  return (
    <View style={[globalStyles.screenStyles.container, {alignItems: 'center'}]}>
      {selectedSetting === 'default' && (
        <View>
         <View style={[{ alignItems: 'center' }]}>
           <MaterialIcons name="settings" size={85} color="orange" />
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

                 <Button color="orange" title="Submit Feedback"  />
               </View>
          )}
        </View>
      )}
    </View>
  );
};

export default SettingScreen;