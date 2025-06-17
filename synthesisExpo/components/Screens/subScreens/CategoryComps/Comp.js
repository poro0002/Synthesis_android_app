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


const CompComp = ({ compData }) =>{

     const { 
        handleCompElement, 
        toggleSelection, 
        errorMessage, 
        setErrorMessage,
        setSelectedElements,
        selectedElements,
    } = useAuth();

     const navigation = useNavigation();

    return(
      <View style={{marginBottom: 50}}>
        <Text style={[globalStyles.screenStyles.h2, {textAlign: 'center'}]}>
          Tap To Add Typo Scale
        </Text>
        {compData && compData.map((element, index) => (
             <View key={index}>
                <Pressable 
                onPress={() => toggleSelection('comp', element)}
                  style={{
                    marginTop: 50,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 5,
                    padding: 20,
                    alignItems: 'center',
                  }}>
                    
                    <View style={globalStyles.screenStyles.checkCircle}>
                          {selectedElements.comp.some((item) => item.package === element.package) && ( // this is just matching the circle with the corrospponding element
                               <View style={globalStyles.screenStyles.filledCircle} />
                            )}
                    </View>

                    <Text style={{color: 'black', fontSize:  30, fontFamily: element.name }}>{element.package}</Text>
                  
                  
                </Pressable>
                <Pressable style={{ 
                    marginTop: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    alignItems: 'center',}} 
                    onPress={()=> handleCompElement(navigation, 'component', element )  }>
                  <Text>
                    View
                  </Text>
                </Pressable>
          </View>
        ))}
      </View>
    )

}


export default CompComp;