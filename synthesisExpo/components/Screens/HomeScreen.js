
import globalStyles from '../../styles';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';


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
  Pressable, // Import Pressable for user interactions
  SafeAreaView
} from 'react-native';

import { useAuth } from '../../LogContext'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo vector icons
import VideoBackground from './Bkgd/VideoBackground'; 
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';




const HomeScreen = () => {

     const [topic, setTopic] = useState("home");
     const navigation = useNavigation();
    
     const { setSelectedElements, username } = useAuth();
    
     const headerHeight = useHeaderHeight();

     // selected elements state var is used on multiple screens so if canceled(returns to home) they need to be cleared so it doesn't interfere

     // In React, every call to setState  triggers a re-render, even if you’re “re-setting” the same data. 
     // so this code below basically compares the previous data to the current state
     // and if its runs true it returns the prev state, and if false it updates
    
     useFocusEffect(
          useCallback(() => {
            setSelectedElements(prev => {
              const isAlreadyCleared = Object.values(prev).every(arr => Array.isArray(arr) && arr.length === 0); // compares
              return isAlreadyCleared ? prev : {
                fonts: [],
                gradients: [],
                typography: [],
                icons: [],
                comp: [],
                name: [],
                about: [],
              };
            });
          }, [setSelectedElements])
        );


        useEffect(() => {
          console.log('🔁 HomeScreen rendered');
        }, []);

 
     const handleTopic = async (selectedTopic) => {
         setTopic(selectedTopic);
         console.log(selectedTopic)
        
         navigation.navigate('Topic', { topic: selectedTopic, username: username });
     }

  // this code makes it so when the navigation stack says that you are currently on this screen it rerenders the getUsername function 
  
const handleCustomDesign = () => {
     console.log('handleCustomDesign clicked !')
     navigation.navigate('CustomDesignScreen');
}

useLayoutEffect(() => {
     navigation.setOptions({
       headerRight: () => (
         <Pressable onPress={handleCustomDesign} style={{ marginRight: 16}}>
         
           <MaterialIcons style={globalStyles.screenStyles.iconShadow} name="add" size={35} color="blue" />
          
         </Pressable>
       ),
     });
   }, [navigation]);
      
   

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
     <View style={{flex: 1, position: 'relative', alignItems: 'center', zIndex: 0}}>
     <VideoBackground pointerEvents="none" source={require('../../assets/gradient5.mp4')} />

     <View style={{ flex: 1, zIndex: 1 }}>
       <ScrollView   
                 contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20}}
                 keyboardShouldPersistTaps="handled"
                 >
        
               <Text style={[globalStyles.screenStyles.h1, globalStyles.screenStyles.textShadow, {textAlign: 'center'}]}>Welcome {username}</Text>
             
         
        <Text style={globalStyles.screenStyles.text}>What are you Looking For ?</Text>
         
 

      <View style={globalStyles.screenStyles.row}>

        <Pressable onPress={() => handleTopic('entertainment')} style={globalStyles.screenStyles.topicComp}>
             <Text style={globalStyles.screenStyles.topicText}>Entertainment</Text>
        </Pressable>

        <Pressable onPress={() => handleTopic('tech')} style={globalStyles.screenStyles.topicComp}>
               <Text style={globalStyles.screenStyles.topicText}>Tech</Text>
          </Pressable>

         <Pressable onPress={() => handleTopic('health')} style={globalStyles.screenStyles.topicComp}>
               <Text style={globalStyles.screenStyles.topicText}>Health</Text>
          </Pressable>

      </View>
      <View style={globalStyles.screenStyles.row}>

            <Pressable onPress={() => handleTopic('food')} style={globalStyles.screenStyles.topicComp}>
                  <Text style={globalStyles.screenStyles.topicText}>Food</Text>
             </Pressable>

              <Pressable onPress={() => handleTopic('finance')} style={globalStyles.screenStyles.topicComp}>
                  <Text style={globalStyles.screenStyles.topicText}>Finance</Text>
             </Pressable>

              <Pressable onPress={() => handleTopic('sport')} style={globalStyles.screenStyles.topicComp}>
                   <Text style={globalStyles.screenStyles.topicText}>Sport</Text>
              </Pressable>
       </View>

  <View style={globalStyles.screenStyles.row}>

             <Pressable onPress={() => handleTopic('travel')} style={globalStyles.screenStyles.topicComp}>
                   <Text style={globalStyles.screenStyles.topicText}>Travel</Text>
              </Pressable>

               <Pressable onPress={() => handleTopic('music')} style={globalStyles.screenStyles.topicComp}>
                   <Text style={globalStyles.screenStyles.topicText}>Music</Text>
              </Pressable>

               <Pressable onPress={() => handleTopic('education')} style={globalStyles.screenStyles.topicComp}>
                    <Text style={globalStyles.screenStyles.topicText}>Education</Text>
               </Pressable>
        </View>

         <Text style={globalStyles.screenStyles.h4}>Popular</Text>

  <View style={globalStyles.screenStyles.row}>

             <Pressable style={globalStyles.screenStyles.popularComp}>
                   <Text style={globalStyles.screenStyles.topicText}>insert popular color or font here</Text>
              </Pressable>

               <Pressable style={globalStyles.screenStyles.popularComp}>
                   <Text style={globalStyles.screenStyles.topicText}>insert popular color or font here</Text>
              </Pressable>

               <Pressable style={globalStyles.screenStyles.popularComp}>
                    <Text style={globalStyles.screenStyles.topicText}>insert popular color or font here</Text>
               </Pressable>
        </View>

           <Text style={globalStyles.screenStyles.h4}>Recently Added</Text>

  <View style={globalStyles.screenStyles.row}>

             <Pressable style={globalStyles.screenStyles.recentlyComp}>
                   <Text style={globalStyles.screenStyles.topicText}>Pkg 1</Text>
              </Pressable>

               <Pressable style={globalStyles.screenStyles.recentlyComp}>
                   <Text style={globalStyles.screenStyles.topicText}>Pkg 2</Text>
              </Pressable>

               <Pressable style={globalStyles.screenStyles.recentlyComp}>
                    <Text style={globalStyles.screenStyles.topicText}>Pkg 3</Text>
               </Pressable>
        </View>

        </ScrollView>

      </View>
      </View>
 </SafeAreaView>     
  );
};

export default HomeScreen;
