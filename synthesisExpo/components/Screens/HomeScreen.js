
import globalStyles from '../../styles';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo vector icons

const HomeScreen = ({username}) => {

     const [topic, setTopic] = useState("home");
     const navigation = useNavigation();
     const [storedUsername, setUsername] = useState("");

     const getUsername = async ()=> {
          let username1 = await AsyncStorage.getItem('username');
          setUsername(username1);
     }

     const handleTopic = async (selectedTopic) => {
         setTopic(selectedTopic);
         console.log(selectedTopic)
        
         navigation.navigate('Topic', { topic: selectedTopic, username: storedUsername });
     }

  // this code makes it so when the navigation stack says that you are currently on this screen it rerenders the getUsername function 
     useFocusEffect(
          useCallback(() => {
            getUsername();
          }, [])
        );
      
   

  return (
    <View style={globalStyles.screenStyles.container}>
        <Text style={globalStyles.screenStyles.h1}>Hello {storedUsername}</Text>

   
        <Text style={globalStyles.screenStyles.text}>What are you Looking For ?</Text>
          <Pressable style={globalStyles.screenStyles.fab}>
               <MaterialIcons name="add-circle-outline" size={60} color="orange" />
          </Pressable>
 

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

      </View>
  );
};

export default HomeScreen;
