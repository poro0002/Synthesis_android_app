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
  Button
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'

import Icon from './Icon'


const MyDesignScreen = ({route}) => {
    const {data} = route.params;
    console.log("data:", data)

  const navigation = useNavigation();

  const handleViewElement = (element, type) => {
    navigation.navigate('Element',{element: element, type: type}) 
 }

 const handleIconElement = (iconType) => {
    navigation.navigate('Element', { iconType: iconType, data: data }) 
}

const handleCompElement = (type) => {
  navigation.navigate('Element', {type: type, data: data}) 

}

 const deleteElement = async (element, type) => { 
    // slice or splice and return a new array without the corro element and update the data use state with the new structure\
    

    const fetchURL = `http://10.0.2.2:4500/deleteElement?type=${type}id=${element.id}username=${element.username}`;
    const fetchHeaders = new Headers({'Content-Type': 'application/json'});

    const fetchOptions = {
        method: "DELETE",
        headers: fetchHeaders,
        mode: 'cors',
    }

    try{
        let response = await fetch(fetchURL, fetchOptions);

        if(!response.ok){
            throw new error ('there was an error with the response')
        }

        let data = await response.json();

        if(data.message === 'Element successfully deleted from the system.'){
            
            

        }

        console.log(data.message)

       
    }catch(err){
        console.log("there was an error with the fetch", err)
    }
 }

  return(
    <View style={[globalStyles.screenStyles.container, {alignItems: 'center'}]}>
         <ScrollView   
            contentContainerStyle={{  flexDirection: 'column'}}
            keyboardShouldPersistTaps="handled"
            >

 {/* ----------------------------------------------------< FONTS >--------------------------------------------------- */} 

    <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Fonts</Text>

           <ScrollView   
             contentContainerStyle={{  flexDirection: 'column'}}
             keyboardShouldPersistTaps="handled"
             horizontal
           >

                {data && data.fonts && data.fonts.length > 0 && (
                      data.fonts.map((element, index) => {
                        return (
                          <View key={index}>
                              <View key={index} style={globalStyles.screenStyles.box}>
                                <Text style={[{ fontFamily: element.name, color: 'black', fontSize: 40 }]}>T t</Text>
                                <Text style={{ fontFamily:  element.name }}>{element.name}</Text>
                             </View>       
                              <View style={{flexDirection: 'column', justifyContent: 'center',}}>
                                <Pressable onPress={() => handleViewElement(element, "font")}  style={globalStyles.screenStyles.viewBtn}>
                                 <Text >View</Text>
                               </Pressable>
                               <Pressable onPress={() => deleteElement(element, "font")}  style={[globalStyles.screenStyles.viewBtn, {backgroundColor: 'red'}]}>
                                 <Text >Delete</Text>
                               </Pressable>
                            </View>
                          </View>
                        );
                      })
                 )}
          </ScrollView>

 {/* ----------------------------------------------------< COLORS >---------------------------------------------------  */}  

 <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Color Gradients</Text>
         
          <ScrollView   
             contentContainerStyle={{  flexDirection: 'column'}}
             keyboardShouldPersistTaps="handled"
             horizontal
           >

                {data && data.gradients && data.gradients.length > 0 && (
                    data.gradients.map((element, index) => {  
                        return (
                        <View>     
                           <LinearGradient
                            key={index} style={globalStyles.screenStyles.box}
                            colors={element.colors} // Array of colors
                             // Adjust style as needed
                            start={{ x: 0, y: 0 }} // Gradient start (top-left)
                            end={{ x: 1, y: 1 }} // Gradient end (bottom-right)
                            >
                          <Text style={{ color: '#fff'}}>{element.name}</Text>
                          </LinearGradient>
                      
                         <View style={{flexDirection: 'column', justifyContent: 'center',}}>
                              <Pressable onPress={() => handleViewElement(element, "color")}  style={globalStyles.screenStyles.viewBtn}>
                                 <Text >View</Text>
                               </Pressable>
                               <Pressable onPress={() => deleteElement(element, "color")}  style={[globalStyles.screenStyles.viewBtn, {backgroundColor: 'red'}]}>
                                 <Text >Delete</Text>
                               </Pressable>
                         </View>
                       </View>
                        );
                    })  
                        
                 )}
          </ScrollView>

  {/* ----------------------------------------------------< TYPOGRAPHY >---------------------------------------------------  */}           

 <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Typography</Text>

           <ScrollView   
             contentContainerStyle={{  flexDirection: 'column'}}
             keyboardShouldPersistTaps="handled"
             horizontal
           >
            {data && data.typography && data.typography.length > 0 && (
                data.typography.map((element, index) => { 
                    return(
                <View>

                  <View key={index} style={globalStyles.screenStyles.box}>
                     <Text>Typography Scale</Text> 
                  </View>

                   <View style={{flexDirection: 'column', justifyContent: 'center',}}>
                     <Pressable  onPress={() => handleCompElement("typography")}  style={globalStyles.screenStyles.viewBtn}>
                        <Text >View</Text>
                      </Pressable>
                      <Pressable onPress={() => deleteElement(element, "typography")}  style={[globalStyles.screenStyles.viewBtn, {backgroundColor: 'red'}]}>
                        <Text >Delete</Text>
                      </Pressable>
                 </View>

              </View>
                    )
                }) 
            )}
         </ScrollView>

{/* ----------------------------------------------------< ICONS >---------------------------------------------------  */} 

<Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Icons</Text>

        <ScrollView   
             contentContainerStyle={{  flexDirection: 'column'}}
             keyboardShouldPersistTaps="handled"
             horizontal
           >
        {data && data.icons && data.icons.length > 0 && (
            data.icons.map((element, index) => { 
                return(
                 <View key={index}>

                      <View  style={globalStyles.screenStyles.box}>
                         <Icon type={element.name} />
                         <Text>{element.name}</Text> 
                    
                      </View>

                       <View style={{flexDirection: 'column', justifyContent: 'center',}}>
                         <Pressable  onPress={() => handleIconElement(element.name)}  style={globalStyles.screenStyles.viewBtn}>
                            <Text >View</Text>
                          </Pressable>
                          <Pressable onPress={() => deleteElement(element, "icon")}  style={[globalStyles.screenStyles.viewBtn, {backgroundColor: 'red'}]}>
                            <Text >Delete</Text>
                          </Pressable>
                     </View>

                 </View>
                    )
                }) 
            )}
       </ScrollView>



{/* ----------------------------------------------------< COMPONENTS >---------------------------------------------------  */} 


<Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Styled Components</Text>


        <ScrollView   
             contentContainerStyle={{  flexDirection: 'column'}}
             keyboardShouldPersistTaps="handled"
             horizontal
           >
             {data && data.comp && data.comp.length > 0 && (
                data.comp.map((element, index) => { 
                return(
                  <View key={index}>

                   <View  style={globalStyles.screenStyles.box}>
                         <Text>{element.package}</Text> 
                    
                      </View>
                    {/* components property in {data} is an array here which is causing issues on the elements screen */}
                        <Pressable onPress={() => handleIconElement('component')} style={globalStyles.screenStyles.viewBtn}>
                            <Text>View</Text>
                          </Pressable >
                        <Pressable onPress={() => deleteElement(element, "icon")}  style={[globalStyles.screenStyles.viewBtn, {backgroundColor: 'red'}]}>
                            <Text >Delete</Text>
                        </Pressable>

                  </View>
                    
                  )
                })
                
             )}



        </ScrollView>   
    </ScrollView>

  </View>
  )


}


export default MyDesignScreen;