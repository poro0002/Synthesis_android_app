
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
import { useHeaderHeight } from '@react-navigation/elements';
import VideoBackground from './Bkgd/VideoBackground'; 
import { ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';

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
  const headerHeight = useHeaderHeight();
  
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
  //   console.log('Updated designSystemData:', designSystemData[0].fonts);
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
  

  // useEffect(() => {
  //   console.log("✅ Updated favData:", JSON.stringify(favData, null, 2));
  // }, [favData]);


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
    <View style={{flex: 1, position: 'relative', alignItems: 'center'}}>
       <ImageBackground
                     source={require('../../assets/grey-gradient.jpg')}
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
                     />
                 </ImageBackground>
      
        
      <View style={globalStyles.screenStyles.mainView}>
     <ScrollView   
        contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20}}
        keyboardShouldPersistTaps="handled"
        >
       <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left', }}>
          <Text style={[globalStyles.screenStyles.h2]}>My Projects</Text>
           <LottieView
                source={require('../../assets/animation5.json')}
                autoPlay
                loop={false} 
                style={{ width: 100, height: 100, alignSelf: 'center'}}
              />
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
                  shadowColor: 'black', // Shadow color
                  shadowOffset: { width: 2, height: 2 }, // Shadow offset
                  shadowOpacity: 1, // Shadow opacity
                  shadowRadius: 3, // Shadow radius
                  elevation: 5, // Android shadow
                  borderColor: 'white',
                  borderWidth: 1,
                }}
              >
                <LinearGradient
                   colors={(element.gradients?.[0]?.colors && element.gradients[0].colors.length > 0) ? element.gradients[0].colors : ['black', 'black']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    borderRadius: 5,
                    padding: 20,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={[globalStyles.screenStyles.textShadow, { color: 'white', fontWeight: 'bold', fontSize: 18, fontFamily: element.fonts[0].name , marginBottom: 5,}]}>
                        {element.name}
                      </Text>
                      <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5 }}>{element.about}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <MaterialIcons  style={globalStyles.screenStyles.iconShadow} name="palette" size={32} color="white" />
                      <MaterialIcons style={globalStyles.screenStyles.iconShadow}  name="brush" size={32} color="white" />
                    </View>
                  </View>
              
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'white' }}>{element.createdAt}</Text>
                  </View>
                </LinearGradient>
             
              </Pressable>

                 <MaterialIcons style={[globalStyles.screenStyles.iconShadow, {marginLeft: 20}]} name='arrow-forward'size={32} color="white" />
    
            </View>
  ))
) : (
  <Text style={{marginTop: 20, color: 'white'}}>No design systems found for this user</Text>
)} 

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginTop: 35 }}>
          <Text style={[globalStyles.screenStyles.h2]}> Favorites</Text>
          <LottieView
                source={require('../../assets/animation4.json')}
                autoPlay
                loop={false} 
                style={{ width: 100, height: 100, alignSelf: 'center'}}
              />
          
      </View>


{/* -------------------------------------------------------------------------------------------------------------------------------  */}
 {/* ----------------------------------------------------< FAVORITES >---------------------------------------------------  */}
 {/* -------------------------------------------------------------------------------------------------------------------------------  */}
     


      <View style={[globalStyles.screenStyles.column,{marginTop: 20} ]}>
        {/* add favorite elements for corro user here */}

     
     {/* ----------------------------------------------------< FONTS >---------------------------------------------------  */}
       
       
  {favoriteFonts && favoriteFonts.length > 0 && (
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Fonts ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
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
              
                  
                    <Text style={[{ fontFamily: matchingFont, color: 'white', fontSize: 40 }]}>T t</Text>
                   
                    <Text style={{ fontFamily: matchingFont, color: 'white' }}>{element.name}</Text>

                </View>
                {/*Instead of passing a reference to the function (handleViewElement(element)), you’re calling it during the render phase, causing it to execute immediately and navigate without waiting for a user click.*/}
                  <Pressable onPress={() => handleViewElement(navigation, element, "font")}  style={globalStyles.screenStyles.viewBtn}>
                    <Text style={{color: 'white'}}>View</Text>
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
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Color Gradients ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
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
                     <Text style={{color: 'white'}}>View</Text>
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
           <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Typography ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
             <ScrollView 
                  horizontal // Enables horizontal scrolling
                   showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                   contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
               >
            { favoriteTypo.map((element, index) =>{
                  return(
                           <View key={index}>
                                  <View style={globalStyles.screenStyles.box}>
                                    <Text style={{ color: 'white' }}>Typography Scale</Text>
                                    <Text style={{fontWeight: 'bold', color: 'white'}}>{element.name}</Text>
                                  </View>

                                <Pressable onPress={() => handleTypoElement(navigation, "typography", element)} style={globalStyles.screenStyles.viewBtn}>
                                <Text style={{color: 'white'}}>View</Text>
                                </Pressable>
                           </View>  
                          )})}
                </ScrollView>
               </>
              )}

{/* -----------------------------------------------< ICONS  >-----------------------------------------------  */}

{favoriteIcons && favoriteIcons.length > 0 && (
  <>
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Icons ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={globalStyles.screenStyles.scrollContainer}
    >
      {favoriteIcons.map((icon, index) => (
        <View key={`${icon.id}-${index}`} style={{ marginRight: 10 }}>
          <View style={globalStyles.screenStyles.box}>
            <Icon type={icon.iconType} minimal />
            <Text style={{ color: 'white' }}>{icon.iconType}</Text>
          </View>
          <Pressable
            onPress={() => handleIconElement(navigation, icon.iconType)}
            style={globalStyles.screenStyles.viewBtn}
          >
             <Text style={{color: 'white'}}>View</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  </>
)}


{/* -----------------------------------------------< COMPONENT  >-----------------------------------------------  */}

{favoriteComp && favoriteComp.length > 0 && (
  <>
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Components ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={globalStyles.screenStyles.scrollContainer}
    >
      {favoriteComp.map((item, index) => (
        <View key={`${item.id}-${index}`} style={{ marginRight: 10 }}>
          <View style={globalStyles.screenStyles.box}>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>
           Component
        </Text>
            <Text style={{ color: 'white' }}>{item.package}</Text>
          </View>
          <Pressable
            onPress={() => handleCompElement(navigation, item.type, item)}
            style={globalStyles.screenStyles.viewBtn}
          >
            <Text style={{color: 'white'}}>View</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>

 </>
)}
  {
    (!favData || favData.length === 0) &&  (
      <Text style={{marginTop: 20, color: 'white'}}>
        No design systems found for this user
      </Text>
    )
  }



      </View>
      </ScrollView>   
      </View>
    </View>
  );
};

export default ProjectScreen;