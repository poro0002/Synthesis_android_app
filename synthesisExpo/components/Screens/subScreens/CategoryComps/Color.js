import globalStyles from '../../../../styles';
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
  Button,
  SafeAreaView
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { MaterialIcons } from '@expo/vector-icons';


import { useAuth } from '../../../../LogContext'; 
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import { useNavigation } from '@react-navigation/native'

// fetch ALL the corro fonts data and map through it with a single component


const ColorComp = ({ compData }) =>{

    const { 
       handleViewElement, 
       toggleSelection, 
       setSelectedElements, 
       selectedElements,
   } = useAuth();

    const navigation = useNavigation();

   return(
     <View >
       <Text style={[globalStyles.screenStyles.h2, {textAlign: 'center'}]}>
         Tap To Add Color Gradient
       </Text>
       {compData && compData.map((element, index) => (
            <View key={index}>
                <LinearGradient
                      key={index}
                      colors={element.colors} // Gradient colors array
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        marginTop: 50,
                        borderRadius: 5,
                        overflow: 'hidden', // ensures child corners match
                        borderColor: 'white',
                        borderWidth: 1,
                      }}
                    >
                         <View style={globalStyles.screenStyles.checkCircle}>
                         {selectedElements.gradients.some((item) => item.name === element.name) && ( // this is just matching the circle with the corrospponding element
                              <View style={globalStyles.screenStyles.filledCircle} />
                           )}
                        </View>

                    <Pressable 
                    onPress={() => toggleSelection('gradients', element)}
                      style={{
                        marginTop: 50,
                        borderRadius: 5,
                        padding: 20,
                        alignItems: 'center',
                      }}>
                   
                

                   <Text style={{color: 'white', fontSize:  30,  }}>{element.name}</Text>
                   <Text style={{color: 'white', fontSize:  10, }}>{element.colors[0]}</Text>
                   <Text style={{color: 'white', fontSize:  10, }}>{element.colors[1]}</Text>
                 
                 </Pressable>
               </LinearGradient>
               <Pressable style={{ 
                   marginTop: 10,
                   backgroundColor: 'transparent',
                   borderColor: 'white',
                   borderWidth: 1,
                   borderRadius: 5,
                   paddingVertical: 10,
                   paddingHorizontal: 20,
                   alignItems: 'center',}} 
                   onPress={()=> handleViewElement(navigation, element, 'color')  }>
                 <Text style={{color: 'white'}}>
                   View
                 </Text>
               </Pressable>
         </View>
       ))}
     </View>
   )

}


export default ColorComp;