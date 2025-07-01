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
import { useHeaderHeight } from '@react-navigation/elements';
import { ImageBackground } from 'react-native';

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
    const headerHeight = useHeaderHeight();

    const allIconTypes = [
        { key: 'feather', label: 'Feather Icons', Component: Feather, icon: 'folder' },
        { key: 'evil', label: 'Evil Icons', Component: EvilIcons, icon: 'search' },
        { key: 'simple', label: 'SimpleLine Icons', Component: SimpleLineIcons, icon: 'folder' },
        { key: 'octicons', label: 'Octicons Icons', Component: Octicons, icon: 'repo' },
        { key: 'ionicons', label: 'Ionicons', Component: Ionicons, icon: 'folder' },
        { key: 'fontawesome', label: 'Fontawesome Icons', Component: FontAwesome5, icon: 'folder' },
        { key: 'material', label: 'Material Icons', Component: MaterialIcons, icon: 'folder' },
      ];

      useFocusEffect(
        useCallback(() => {
          if (!compData || compData.length === 0) {
            fetchCategoryData(category);
          }
      
          return () => {
            // optional: cleanup memory-heavy states or listeners here
            setCompData(null); // ⬅️ helps if compData is large and not needed after
          };
        }, [category])
      );


    // useEffect(()=>{
       // console.log('display category screen compData:', compData)
    // })


    if ((loading || !compData) && category !== 'icon') {
        return (
          <Modal transparent={true} animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <ActivityIndicator size="large" color="white" />
            <Text style={{ color: 'white', marginTop: 10 }}>Loading assets...</Text>
          </View>
        </Modal>
        );
      }
    


   return(
    <View style={globalStyles.screenStyles.centerContainer}>
            <ImageBackground
                      source={require('../../../assets/grey-gradient.jpg')}
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
                      ></View>
                  </ImageBackground>
       
       <ScrollView   
          contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, backgroundColor: 'transparent', paddingHorizontal: 40,}}
          keyboardShouldPersistTaps="handled"
        >
       
          {/* you should always check the length first when dealing with checking array data */}
            {category === 'fonts' && compData.length > 0 && compData[0].designer && (
                <FontComp compData={compData} />
            )}
             {category === 'color' && compData.length > 0 && compData[0].colors && (
                <ColorComp compData={compData}/>
            )}
             {category === 'typography' && compData.length > 0 && compData &&  (
                <TypoComp compData={compData}/>
            )}
             {category === 'component' && compData.length > 0 && compData  && (
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
                                            backgroundColor: 'transparent',
                                            borderRadius: 5,
                                            padding: 20,
                                            alignItems: 'center',
                                            borderColor: 'white',
                                            borderWidth: 1,
                                       }}
                                        onPress={() => toggleSelection('icons', { name: key })}
                                        >
                                       <View style={globalStyles.screenStyles.checkCircle}>
                                         {selectedElements.icons.some((item) => item.name === key) && (
                                           <View style={globalStyles.screenStyles.filledCircle}></View>
                                         )}
                                       </View>
                                       <Component style={{marginTop: 10}} name={icon} size={50} color="royalblue" />
                                       <Text style={{color: 'white', marginTop: 10}}>{label}</Text>
                                     </Pressable>
                                   </View>
                                   <Pressable
                                     onPress={() => handleIconElement(navigation, key, "icons")}
                                     style={{ 
                                        marginTop: 10,
                                        backgroundColor: 'royalblue',
                                        borderRadius: 5,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        alignItems: 'center',}} 
                                   >
                                     <Text style={{color: 'white'}}>View</Text>
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