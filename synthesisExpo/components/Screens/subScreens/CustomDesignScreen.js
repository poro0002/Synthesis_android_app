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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import { ImageBackground } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { MaterialIcons } from '@expo/vector-icons';
import VideoBackground from '../Bkgd/VideoBackground'; 
import { useHeaderHeight } from '@react-navigation/elements';
import LottieView from 'lottie-react-native';

import Icon from './Icon';
import DisplayScreen from './DisplayCategory'
import { useAuth } from '../../../LogContext'; 
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import { useNavigation } from '@react-navigation/native'

// we need a name and sub title input for the design system that ads it to the selected elements obj
// we needs a selected elements useState that holds a object with each required category, also one of each needs to be selected at least
// maybe create sub screens to show all the elements in that category (fonts, colors, ect..) different Ui tho
// view element/delete element btns will work the same
// create and cancel btns at the bottom

// once these elements have been added they need to be sent back and displayed for the user on this screen




const CustomDesignScreen = ({ route }) => {

    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();

    const { 
        selectedElements, 
        setSelectedElements,
        createSystem,
        errorMessage, 
        setErrorMessage,
        toggleSelection,
        loading,

    } = useAuth();

      const gradientColors = selectedElements.gradients.length > 0 ? selectedElements.gradients[0].colors : ['#4c4c66', '#1a1a2e']; 


  useEffect(() => {

    setErrorMessage('');

  }, []);

  
    const handleViewCategory = (category) =>{

        navigation.navigate('DisplayCategory', {category})
       
    }

    const handleCreate = async () => {
        const success = await createSystem();
        if (success) {
          
          setTimeout(() => {
            navigation.navigate('Tabs', { screen: 'Project' });
          }, 1000); 
      
        }
      };

    const cancelSystem = () => {
        navigation.navigate('Tabs', {
          screen: 'Home',
        });
      }


     useEffect(() => {
      console.log("Selected Elements on custom design screen :\n", JSON.stringify(selectedElements, null, 2));
     }, [selectedElements])
    

    return(

     <View style={{flex: 1, position: 'relative', padding: 20, zIndex: 0}}>
         
         <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: 0,
            }}
          ><View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)', 
              }}
              >
            </View>
            
            </LinearGradient>
              
           <View style={{ flex: 1, zIndex: 1 }}>


      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: headerHeight }}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false} 

      >
              
                <Text style={[globalStyles.screenStyles.h2, {marginBottom: 50, marginTop: 20}]}>
                     Choose Your Elements
                </Text>
           
           <View style={globalStyles.screenStyles.container}>
                <Pressable onPress={() => handleViewCategory("fonts")} style={globalStyles.screenStyles.row}>
                    <View>
                         <Text style={[globalStyles.screenStyles.h3, globalStyles.screenStyles.textShadow, ]}>
                            Fonts
                         </Text>
                        
                         {selectedElements.fonts.length > 0 && (
                             <Text style={[globalStyles.screenStyles.h5, {color: 'lightskyblue'}]}>
                                {selectedElements.fonts.length} Selected Items
                            </Text>
                          )}
                  </View>
                   <MaterialIcons name='arrow-forward'size={32} color="white"/>
                </Pressable>

             

               
            </View> 
                
            <View style={globalStyles.screenStyles.container}>
        
                <Pressable onPress={() => handleViewCategory("color")} style={globalStyles.screenStyles.row}>
                        <View>
                            <Text style={[globalStyles.screenStyles.h3, globalStyles.screenStyles.textShadow]}>
                              Color Gradients
                            </Text>

                            {selectedElements.gradients.length > 0 && (
                             <Text style={[globalStyles.screenStyles.h5, {color: 'lightskyblue'}]}>
                                {selectedElements.gradients.length} Selected Items
                            </Text>
                          )}
                        </View>  
                   <MaterialIcons name='arrow-forward'size={32} color="white"/>
                </Pressable>
            
            </View>
  
           <View style={globalStyles.screenStyles.container}>
                <Pressable onPress={() => handleViewCategory("typography")} style={globalStyles.screenStyles.row}>
                         <View>
                            <Text style={[globalStyles.screenStyles.h3, globalStyles.screenStyles.textShadow]}>
                                Typography Scales
                            </Text>

                          {selectedElements.typography.length > 0 && (
                             <Text style={[globalStyles.screenStyles.h5, {color: 'lightskyblue'}]}>
                                {selectedElements.typography.length} Selected Items
                            </Text>
                          )}
                        </View>  
                   <MaterialIcons name='arrow-forward'size={32} color="white"/>
                </Pressable>
            </View>  
           
            <View style={globalStyles.screenStyles.container}>
              
                <Pressable onPress={() => handleViewCategory("icon")} style={globalStyles.screenStyles.row}>
                <View>
                      <Text style={[globalStyles.screenStyles.h3, globalStyles.screenStyles.textShadow]}>
                          Icons
                      </Text>   
                         {selectedElements.icons.length > 0 && (
                             <Text style={[globalStyles.screenStyles.h5, {color: 'lightskyblue'}]}>
                                {selectedElements.icons.length} Selected Items
                            </Text>
                          )}
                    </View>  
                   <MaterialIcons name='arrow-forward'size={32} color="white"/>
                </Pressable>
           </View>  
           
           <View style={globalStyles.screenStyles.container}>
                <Pressable onPress={() => handleViewCategory("component")} style={globalStyles.screenStyles.row}>
                        <View>
                             <Text style={[globalStyles.screenStyles.h3, globalStyles.screenStyles.textShadow]}>
                                Components
                             </Text>
                          {selectedElements.comp.length > 0 && (
                             <Text style={[globalStyles.screenStyles.h5, {color: 'lightskyblue'}]}>
                                {selectedElements.comp.length} Selected Items
                            </Text>
                          )}
                            
                        </View>  
                     <MaterialIcons name='arrow-forward'size={32} color="white"/>
                </Pressable>
                
           </View>


             {/* -----------------------------------------------< NAMING THE SYSTEM >-----------------------------------------------  */} 
         
          <View style={[{ justifyContent: 'center', alignItems:'flex-start', marginTop: 20}]}>
             <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, {color: 'white'}]}>Name Your Design System</Text>
            <TextInput
                onChangeText={(value) => toggleSelection('name', value)}
                value={selectedElements.name}
                style={[globalStyles.screenStyles.input, {width: '100%', borderColor: 'white', }]}
                placeholder="System Name"
                placeholderTextColor="gray"
                maxLength={15}
            >

            </TextInput>

            <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, {color: 'white', marginTop: 20}]}>Describe Your Design System</Text>

            <TextInput
              onChangeText={(value) => toggleSelection('about', value)}
              value={selectedElements.about}
              style={[globalStyles.screenStyles.input, {width: '100%', borderColor: 'white', }]}
              placeholder="About ( optional )"
              placeholderTextColor="gray"
              maxLength={30}
            >

            </TextInput>

          </View>
        
          
          {errorMessage ? (
            <Text style={{ color: 'orange', textAlign: 'center', marginVertical: 10 }}>
                {errorMessage}
             </Text>
            ) : null}



  {/* -----------------------------------------------< CREATE && CANCEL BTNS >-----------------------------------------------  */} 

  <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems:'center', marginTop: 50, marginBottom: 50}]}>

    <Pressable onPress={cancelSystem}  style={[globalStyles.screenStyles.btn1, globalStyles.screenStyles.btnShadow, {backgroundColor: 'white', color: 'black', marginRight: 20}]}>
       <Text>Cancel</Text>
     </Pressable>

     <Pressable onPress={handleCreate} style={[globalStyles.screenStyles.btn1, globalStyles.screenStyles.btnShadow, {backgroundColor: 'royalblue', color: 'white'}]}>
       <Text>Create</Text>
     </Pressable>

  </View>

    

       </KeyboardAwareScrollView>
     
     </View>   
     </View>  
    )

}

export default CustomDesignScreen;