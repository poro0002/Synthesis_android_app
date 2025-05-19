
import globalStyles from '../../styles'
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'

import { useAuth } from '../../LogContext'; // Adjust path as needed



const ProjectScreen = () => {

  const { designSystemData, getDesignSystem } = useAuth();

  const navigation = useNavigation();
  
  const editDesignSystem = (element) => {
    console.log('designSystemData length on press:', designSystemData.length)
    setTimeout(() => {
      navigation.navigate('MyDesignScreen', { data: element });
    }, 100); // small delay to let state settle
  };
  // edit design system function is not opening the corrosponding design system 
  
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused. Fetching design systems...');
      getDesignSystem();
    }, [])
  );

  useEffect(() => {
    console.log('Updated designSystemData:', designSystemData);
  }, [designSystemData]);



  return (
    <View style={[globalStyles.screenStyles.container, {alignItems: 'center'}]}>
     <ScrollView   
        contentContainerStyle={{  flexDirection: 'column'}}
        keyboardShouldPersistTaps="handled"
        >
       <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left', }}>
          <Text style={[globalStyles.screenStyles.h2, {marginRight: 20}]}>My Projects</Text>
          <MaterialIcons name="folder-special" size={85} color="orange" />
       </View>

      {designSystemData.length > 0 ? (
          designSystemData.map((element, index) => (
            <View key={index} style={{margin: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
               onPress={() => editDesignSystem(element)}
                style={{
                  borderRadius: 5,
                  flexDirection: 'column',
                  width: 300,
                  shadowColor: 'white', // Shadow color
                  shadowOffset: { width: 2, height: 2 }, // Shadow offset
                  shadowOpacity: 1, // Shadow opacity
                  shadowRadius: 3, // Shadow radius
                  elevation: 5, // Android shadow
                  
                }}
              >
                <LinearGradient
                   colors={(element.gradients?.[0]?.colors && element.gradients[0].colors.length > 0) ? element.gradients[0].colors : ['white', 'white']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    borderRadius: 5,
                    padding: 20,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>
                        {element.name}
                      </Text>
                      <Text style={{ color: 'black' }}>{element.about}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <MaterialIcons name="palette" size={32} color="black" />
                      <MaterialIcons name="brush" size={32} color="black" />
                    </View>
                  </View>
              
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black' }}>{element.createdAt}</Text>
                  </View>
                </LinearGradient>
             
              </Pressable>

                 <MaterialIcons name='arrow-forward'size={32} color="white" />
    
            </View>
  ))
) : (
  <Text>No design systems found or loading...</Text>
)} 

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left' }}>
          <Text style={[globalStyles.screenStyles.h3, {marginRight: 20}]}> Favorites</Text>
            <MaterialIcons name="favorite" size={30} color="orange" />
          
      </View>

      <View style={globalStyles.screenStyles.column}>
        {/* add favorite elements for corro user here */}
      </View>
      </ScrollView>   
    </View>
  );
};

export default ProjectScreen;