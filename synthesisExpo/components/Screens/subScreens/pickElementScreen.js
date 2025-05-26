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

import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native';



import Icon from './Icon'
import { useAuth } from '../../../LogContext'; 

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 





const PickElementScreen = ({route}) => {
    const {category, systemId} = route.params;
    // console.log('category:', category, 'username:', username, 'system ID:', systemId)

    const [corroData, setCorroData] = useState();
    const { getDesignSystem, username } = useAuth();

     const navigation = useNavigation();

    


    // so basically we have to run a fetch to the backend and depending on the type we choose before the fetch even


   const fetchPageData = async() => {

    const fetchURL = `${apiUrl}/pickElement?category=${category}`;
    const fetchHeaders = new Headers({'Content-Type': 'application/json'});

    const fetchOptions = {
        method: "GET",
        headers: fetchHeaders,
        mode: 'cors',
    }

    try{
        let response = await fetch(fetchURL, fetchOptions);

        let data = await response.json();

        setCorroData(data)



       
    }catch(err){
        console.log("there was an error with the fetch", err)
    }

   } 

   const addNewElement = async (element, category) => {
      
     // element + category + username + system id to /updateSystem endpoint 

     const fetchURL = `${apiUrl}/updateSystem`;
     const fetchHeaders = new Headers({'Content-Type': 'application/json'});


  // ✅ Wrap the element ONLY if category is 'icons'
  const formattedElement = category === "icons" ? { name: element } : element; // ternary operator that assigns { name: element } if category is "icons", otherwise assigns element as-is 

     const fetchOptions = {
         method: "PATCH",
         headers: fetchHeaders,
         mode: 'cors',
         body: JSON.stringify({
            username: username,
            element: formattedElement,
            category: category,
            systemId: systemId
         })
     }

     console.log("category", category)
 
     try{
         let response = await fetch(fetchURL, fetchOptions);
 
         let data = await response.json();

         if(data.success == true){

           // the code below is running but when the design screen returns,  the new "added element" is a no show

         await getDesignSystem(); 
            navigation.goBack();
            return;
         }else {
            console.log("Update failed:", data.message);
          }

       
        
     }catch(err){
         console.log("there was an error with the fetch", err)
     }
      
   }




// get the data as soon as the page mounts 
   useEffect(() => {
    fetchPageData();
    
   }, [])
   

    
   console.log("pick element corro data", corroData)

   // so basically grab the corro data
   // display it in the same way it is on the other topic screens but just with a VIEW or ADD btn
   // when you click add make sure it adds it to the correct design system you were just viewing by passing a id param and type
   // 

    return(
      
       <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
     
         <ScrollView   
            contentContainerStyle={{  flexDirection: 'column', flexWrap: 'wrap', paddingBottom: 50}}
            keyboardShouldPersistTaps="handled"
            >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>


        {category === "fonts" ? (
                corroData && corroData.map((element, index) => {
                    return(
                        <View key={index} >
                        <View style={globalStyles.screenStyles.box}>
                          <Text style={[{ fontFamily: element.name, color: 'black', fontSize: 40 }]}>T t</Text>
                          <Text style={{ fontFamily: element.name }}>{element.name}</Text>
      
                          </View>
                           <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                           <Pressable onPress={() => addNewElement(element, "fonts")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                        
                         </View>
                         
                      </View>
                       )
                    })
                ):(
                    <Text>
                      something went wrong displaying fonts
                    </Text>
                )}

            {category === "gradients" ? (
                corroData && corroData.map((element, index) => {
                    return(
                     <View key={index} style={{ marginRight: 20, marginBottom: 20 }}>
                         <LinearGradient
                           style={globalStyles.screenStyles.box}
                           colors={element.colors}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                         >
                           <Text style={{ color: '#fff' }}>{element.name}</Text>
                         </LinearGradient>
                         <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                           <Pressable onPress={() => addNewElement(element, "gradients")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                        
                         </View>
                       </View>
                       )
                    })
                ):(
                    <Text>
                      something went wrong displaying gradients
                    </Text>
                )}

            {category === "typography" ? (
                corroData && corroData.map((element, index) => {
                    console.log('element :', element)
                    return(
                     <View key={index} style={{ marginRight: 20, marginBottom: 20 }}>
               
                      <View style={globalStyles.screenStyles.box}>
                        <Text >Typography Scale</Text>
                        <Text style={[{fontWeight: 'bold'}]}>
                          {element[0].name}
                        </Text>
                      </View>

                         <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                           <Pressable onPress={() => addNewElement(element, "typography")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                        
                         </View>
                       </View>
                       )
                    })
                ):(
                    <Text>
                      something went wrong displaying typography
                    </Text>
                )} 

          {category === "icons" ? (
               <>
                 <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Icons</Text>
                 
                     
                      <View>
                         <View style={globalStyles.screenStyles.box}>
                        
                              <Feather name="folder" size={50} color="orange" />
                                <Text >Feather Icons</Text>
                    
                       </View>
                          <Pressable onPress={() => addNewElement("feather", "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
       
                      <View>
                         <View style={globalStyles.screenStyles.box}>

                              <EvilIcons name="search" size={50} height={50} color="orange" />
                                <Text >Evil Icons</Text>
                       </View>
                          <Pressable onPress={() => addNewElement("evil", "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
       
                      <View >
                         <View style={globalStyles.screenStyles.box}>
                
                    
                              <SimpleLineIcons name="folder" size={50} height={50} color="orange" />
                                <Text >SimpleLine Icons</Text>
                    
                            </View>
                           <Pressable onPress={() => addNewElement('simple', "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
       
                      <View>
                         <View style={globalStyles.screenStyles.box}>
                        
                         
                            </View>
                              <Octicons name="repo" size={50} height={50} color="orange" />
                                <Text >Octicons Icons</Text>
                         
                       
                       <Pressable onPress={() => addNewElement('octicons', "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
       
                      <View>
                         <View style={globalStyles.screenStyles.box}>
                            <Ionicons name='folder' width={50} height={50} fill="orange" />
                                <Text >Ionicons</Text>
                         
                       </View>
                        <Pressable onPress={() => addNewElement('ionicons', "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
       
                      <View>
                         <View style={globalStyles.screenStyles.box}>
 
                         <FontAwesome5 name="folder" size={50} color="orange" />
                         <Text >Fontawesome Icons</Text>
                          
                       </View>
                       <Pressable onPress={() => addNewElement('Fontawesome', "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
       
                      <View>
                         <View style={globalStyles.screenStyles.box}>
       
                              <MaterialIcons name="folder" width={50} height={50} fill="orange"/>
                                <Text >Material Icons</Text>
                       </View>
                         <Pressable onPress={() => addNewElement('material', "icons")} style={globalStyles.screenStyles.viewBtn}>
                             <Text>Add</Text>
                           </Pressable>
                      </View>
                      
                   
                    </>
       
                ):(
                    <Text>
                      something went wrong displaying icons
                    </Text>
                )} 



         {category === "comp" ? (
              corroData && corroData.map((element, index) => (
                <View key={index}>
                  <View style={globalStyles.screenStyles.box}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                      {element.package}
                    </Text>
                    <Text style={{ color: 'black' }}>Includes components:</Text>
                    {Object.keys(element.components).map((componentName) => (
                      <Text key={componentName} style={{ color: 'orange' }}>
                        {componentName}
                      </Text>
                    ))}
                  </View>
                  <Pressable
                    onPress={() => addNewElement(element, "comp")}
                    style={globalStyles.screenStyles.viewBtn}
                  >
                    <Text>Add</Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <Text>Something went wrong displaying components</Text>
            )}

      
            


            </View>
            </ScrollView>
     
       </SafeAreaView>
     
    
    )
    
}

export default PickElementScreen;