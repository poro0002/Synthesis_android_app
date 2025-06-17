
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
import Icon from './subScreens/Icon'



const ProjectScreen = () => {

  const { 
    designSystemData, 
    getDesignSystem, 
    checkFavorites, 
    favData,
    handleViewElement,
    handleIconElement,
    handleTypoElement,
    handleCompElement,

  } = useAuth();
 
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
      // console.log('Screen focused. Fetching design systems...');
      getDesignSystem();
    }, [])
  );



  // useEffect(() => {
  //   console.log('Updated designSystemData:', designSystemData);
  // }, [designSystemData]);


  // I have to send the correct favData per element to the element screen when one of the favs "view" btn is clicked navigate = elementScreen
  // this is so its displayed properly with the correct params being passed so the element screen can display it and the removeFav function can work
  // use the "type" property to display the corro fav element from the favData
  // 
 

  useFocusEffect(
    React.useCallback(() => {
      checkFavorites();
      
    }, [])
  );
  

  useEffect(() => {
    console.log("✅ Updated favData:", JSON.stringify(favData, null, 2));
  }, [favData]);


  if (!Array.isArray(favData)) return null;
  
  // filter can only be used on an array 
  // these return an array also
  const favoriteFonts = favData.filter(item => item.type === 'font');
  const favoriteColors = favData.filter(item => item.type === 'color');
  const favoriteIcons = favData.filter(item => item.type === 'icon');
  const favoriteTypo = favData.filter(item => item.type === 'typography');
  const favoriteComp = favData.filter(item => item.type === 'component'); // change this to 'components' to make it consistent ?


  favoriteIcons.map((icon, index) => (
    console.log(icon.iconType)
  ))


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


{/* -------------------------------------------------------------------------------------------------------------------------------  */}
 {/* ----------------------------------------------------< FAVORITES >---------------------------------------------------  */}
 {/* -------------------------------------------------------------------------------------------------------------------------------  */}
     


      <View style={[globalStyles.screenStyles.column,{marginTop: 20} ]}>
        {/* add favorite elements for corro user here */}

     
     {/* ----------------------------------------------------< FONTS >---------------------------------------------------  */}
       
       
  {favoriteFonts && favoriteFonts.length > 0 && (
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Fonts</Text>
          <ScrollView 
                horizontal // Enables horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
            >
               {favoriteFonts.map((element, index) => {
                     
                      const matchingFont = element.name;
                     // Check if the font exists in the global styles
                     if (!matchingFont) {
                       return null; // Skip rendering if font isn't found
                     }
       
                return (
                  <View key={index} >
                  <View style={globalStyles.screenStyles.box}>
              
                  
                    <Text style={[{ fontFamily: matchingFont, color: 'black', fontSize: 40 }]}>T t</Text>
                   
                    <Text style={{ fontFamily: matchingFont }}>{element.name}</Text>

                </View>
                {/*Instead of passing a reference to the function (handleViewElement(element)), you’re calling it during the render phase, causing it to execute immediately and navigate without waiting for a user click.*/}
                  <Pressable onPress={() => handleViewElement(navigation, element, "font")}  style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>
                    );
                  })  
                }  

            </ScrollView>
            </>
          )}

  {/* ---------------------------------------------------< COLORS >---------------------------------------------------  */}

  {favoriteColors && favoriteColors.length > 0 && (
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Color Gradients</Text>
          <ScrollView 
               horizontal // Enables horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
            >
              { favoriteColors.map((element, index) => {
                  
                return (
                <View key={index}>
                  
                   <LinearGradient
                    key={index} style={globalStyles.screenStyles.box}
                    colors={element.colors} // Array of colors
                     // Adjust style as needed
                    start={{ x: 0, y: 0 }} // Gradient start (top-left)
                    end={{ x: 1, y: 1 }} // Gradient end (bottom-right)
                    >
                  <Text style={{ color: '#fff'}}>{element.name}</Text>
                 
                  </LinearGradient>
                
                <Pressable onPress={() => handleViewElement(navigation, element, "color")}   style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>
                );
                  })  
                }  

             </ScrollView>
            </>
          )}

            {/* -----------------------------------------------< TYPOGRAPHY >-----------------------------------------------  */}

   {favoriteTypo && favoriteTypo.length > 0 && (
         
         <>
           <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Typography</Text>
             <ScrollView 
                  horizontal // Enables horizontal scrolling
                   showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                   contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
               >
            { favoriteTypo.map((element, index) =>{
                  return(
                           <View key={index}>
                                  <View style={globalStyles.screenStyles.box}>
                                    <Text style={{ fontWeight: 'bold' }}>Typography Scale</Text>
                                    <Text>{element.name}</Text>
                                  </View>

                                <Pressable onPress={() => handleTypoElement(navigation, "typography", element)} style={globalStyles.screenStyles.viewBtn}>
                                  <Text>View</Text>
                                </Pressable>
                           </View>  
                          )})}
                </ScrollView>
               </>
              )}

{/* -----------------------------------------------< ICONS  >-----------------------------------------------  */}

{favoriteIcons && favoriteIcons.length > 0 && (
  <>
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Icons</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={globalStyles.screenStyles.scrollContainer}
    >
      {favoriteIcons.map((icon, index) => (
        <View key={`${icon.id}-${index}`} style={{ marginRight: 10 }}>
          <View style={globalStyles.screenStyles.box}>
            <Icon type={icon.iconType} minimal />
            <Text style={{ color: 'black' }}>{icon.iconType}</Text>
          </View>
          <Pressable
            onPress={() => handleIconElement(navigation, icon.iconType)}
            style={globalStyles.screenStyles.viewBtn}
          >
            <Text>View</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  </>
)}


{/* -----------------------------------------------< COMPONENT  >-----------------------------------------------  */}

{favoriteComp && favoriteComp.length > 0 && (
  <>
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Components</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={globalStyles.screenStyles.scrollContainer}
    >
      {favoriteComp.map((item, index) => (
        <View key={`${item.id}-${index}`} style={{ marginRight: 10 }}>
          <View style={globalStyles.screenStyles.box}>
        <Text style={{ fontWeight: 'bold' }}>
           Component
        </Text>
            <Text style={{ color: 'black' }}>{item.package}</Text>
          </View>
          <Pressable
            onPress={() => handleCompElement(navigation, item.type, item)}
            style={globalStyles.screenStyles.viewBtn}
          >
            <Text>View</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  </>
)}



      </View>
      </ScrollView>   
    </View>
  );
};

export default ProjectScreen;