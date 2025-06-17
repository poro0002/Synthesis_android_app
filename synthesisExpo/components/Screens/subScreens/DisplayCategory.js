import globalStyles from '../../../styles';
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

import Icon from './Icon';
import { useAuth } from '../../../LogContext'; 
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import { useNavigation } from '@react-navigation/native'

// components
import FontComp from './CategoryComps/Font'
import ColorComp from './CategoryComps/Color'
import TypoComp from './CategoryComps/Typo'
import CompComp from './CategoryComps/Comp'



const DisplayCategory = ({ route }) => {

    const { category } = route.params;
    const { fetchCategoryData, compData, setCompData, loading, handleIconElement, selectedElements, toggleSelection } = useAuth();

    const navigation = useNavigation();

    const allIconTypes = [
        { key: 'feather', label: 'Feather Icons', Component: Feather, icon: 'folder' },
        { key: 'evil', label: 'Evil Icons', Component: EvilIcons, icon: 'search' },
        { key: 'simple', label: 'SimpleLine Icons', Component: SimpleLineIcons, icon: 'folder' },
        { key: 'octicons', label: 'Octicons Icons', Component: Octicons, icon: 'repo' },
        { key: 'ionicons', label: 'Ionicons', Component: Ionicons, icon: 'folder' },
        { key: 'fontawesome', label: 'Fontawesome Icons', Component: FontAwesome5, icon: 'folder' },
        { key: 'material', label: 'Material Icons', Component: MaterialIcons, icon: 'folder' },
      ];

    useEffect(()=>{
        
        fetchCategoryData(category);
        
    },[category]);

    console.log('display category comp data:', compData)
    console.log(category)

    if ((loading || !compData) && category !== 'icon') {
        return (
          <View style={globalStyles.screenStyles.centerContainer}>
            <Text>Loading category data...</Text>
          </View>
        );
      }
    


   return(
    <View style={globalStyles.screenStyles.centerContainer}>
       
       <ScrollView   
          contentContainerStyle={{  flexDirection: 'column'}}
          keyboardShouldPersistTaps="handled"
        >
            {category === 'fonts' && compData[0].designer && compData.length > 0 && (
                <FontComp compData={compData} />
            )}
             {category === 'color' && compData[0].colors && compData.length > 0 && (
                <ColorComp compData={compData}/>
            )}
             {category === 'typography' && compData && compData.length > 0 && (
                <TypoComp compData={compData}/>
            )}
             {category === 'component' && compData && compData.length > 0 && (
                <CompComp compData={compData} />
            )}
             {category === 'icon' && (
                <View style={{marginBottom: 50}}>               
                    {allIconTypes.map(({ key, label, Component, icon }) => (
                                 <View key={key}>
                                   <View>
                                     <Pressable  
                                       style={{
                                            marginTop: 50,
                                            backgroundColor: '#f8f8f8',
                                            borderRadius: 5,
                                            padding: 20,
                                            alignItems: 'center',
                                       }}
                                        onPress={() => toggleSelection('icons', { name: key })}
                                        >
                                       <View style={globalStyles.screenStyles.checkCircle}>
                                         {selectedElements.icons.some((item) => item.name === key) && (
                                           <View style={globalStyles.screenStyles.filledCircle}></View>
                                         )}
                                       </View>
                                       <Component name={icon} size={50} color="orange" />
                                       <Text>{label}</Text>
                                     </Pressable>
                                   </View>
                                   <Pressable
                                     onPress={() => handleIconElement(navigation, key, "icons")}
                                     style={{ 
                                        marginTop: 10,
                                        backgroundColor: '#f8f8f8',
                                        borderRadius: 5,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        alignItems: 'center',}} 
                                   >
                                     <Text>View</Text>
                                   </Pressable>
                                 </View>
                         ))}
                </View>
            )}

        </ScrollView>

    </View>
   )

}


export default DisplayCategory;