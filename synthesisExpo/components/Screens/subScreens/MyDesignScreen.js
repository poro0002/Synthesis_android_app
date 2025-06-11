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

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'

import Icon from './Icon'
import { useAuth } from '../../../LogContext'; 

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 


const MyDesignScreen = ({route}) => {
  const { data } = route?.params || {}; // we now get data from the react context pattern
    // console.log("data:", data);

  const { designSystemData, getDesignSystem, setDesignSystemData } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0); // Defaults to showing the first design system
  const [currentSystem, setCurrentSystem] = useState(data); // keep this

  // console.log('design screen current system', currentSystem)

  // console.log('design screen typo data:', [currentSystem.typography[0]])
 

  const navigation = useNavigation();

  const handleViewElement = (element, type) => {
    navigation.navigate('Element', {
      element: element, 
      type: type
    }) 
    console.log('myDesignScreen type:', type)
    console.log('myDesignScreen element:', element)
 }

 const handleIconElement = (iconType, type) => {
    navigation.navigate('Element', { 
      iconType,
      type
    
    }) 
    console.log("my design screen iconType", iconType)
}


const handleTypoElement = (type, currentSystem, element) => {
  navigation.navigate('Element', { 
    type,
    data: currentSystem.typography ? [currentSystem.typography[0]] : [],  
    screenType: "design"  
  });
    console.log('myDesignScreen element:', element)
    console.log('myDesignScreen type:', type)
};



const handleCompElement = (type, element) => {
  navigation.navigate('Element', { 
    type,
    data: element, 
  });
  console.log('myDesignScreen element:', element)
  console.log('myDesignScreen type:', type)
};

useFocusEffect(
  useCallback(() => {
    console.log('Screen focused. (myDesignScreen) Refetching design system...');
    getDesignSystem(); // <-- this should call your backend and refresh data
  }, [])
);

  

// this basically keeps an eye on the designSystemData Var and if a new system has been created it updates it.\
// when the currentSystem state gets updated it does the same to the designSystemData State
useEffect(() => {
  if (!designSystemData || designSystemData.length === 0){
    return;
  }

  // Find the current system by ID in the updated designSystemData
  const updatedSystem = designSystemData.find(system => system.id === currentSystem?.id);

  if (updatedSystem) {
   setCurrentSystem({ ...updatedSystem });
  }
}, [designSystemData]);


{/* ----------------------------------------------------< ADD Element  >--------------------------------------------------- */} 

const addElement = (category, systemId) =>{
  // add element functionality after i fix this delete element issues
   console.log("Navigating to PickElementScreen with category:", category, "and systemId:", systemId);

  navigation.navigate('PickElementScreen', {
    category: category,
    systemId: systemId,
    // username: currentSystem.username
  });

}


{/* ----------------------------------------------------< Delete Element  >--------------------------------------------------- */} 

 const deleteElement = async (element, type, systemId, index) => {
    
  //  console.log('Deleting element from system:', systemId, 'type:', type, 'index:', index, element.username);
  

    const fetchURL = `${apiUrl}/deleteElement`;
    const fetchHeaders = new Headers({'Content-Type': 'application/json'});

    const fetchOptions = {
        method: "DELETE",
        headers: fetchHeaders,
        mode: 'cors',
        body: JSON.stringify({
          username: currentSystem.username,
          type: type,
          id: systemId,
          index: index,
        })
    }

    try{
        let response = await fetch(fetchURL, fetchOptions);

        let data = await response.json();

        if(data.message === 'Element successfully deleted from the system'){

          await new Promise(resolve => setTimeout(resolve, 500)); 
          // basically this is a async version of a timeout  
          // good for giving the backend a chance to update before the code moves forward

           await getDesignSystem();

        }

        console.log(data.message)

       
    }catch(err){
        console.log("there was an error with the fetch", err)
    }
 }

{/* ----------------------------------------------------< Delete System >--------------------------------------------------- */} 
 const deleteSystem = async (id) =>{


  const fetchURL = `${apiUrl}/deleteSystem`;
  const fetchHeaders = new Headers({'Content-Type': 'application/json'});

  const fetchOptions = {
      method: "DELETE",
      headers: fetchHeaders,
      mode: 'cors',
      body: JSON.stringify({
        username: currentSystem.username,
        id: id,
      })
  }

  try{
      let response = await fetch(fetchURL, fetchOptions);

      let data = await response.json();

      if(data.message === 'Design system successfully deleted'){
        console.log('Deletion confirmed, updating local state...');

        // prevdata is the systems with the one we want to delete. we match the id and remove it updating the designsystemdata
        setDesignSystemData(prevData => prevData.filter(system => system.id !== id));

        navigation.navigate('Tabs', {
          screen: 'Project',
        });


        // Refresh in the background
        getDesignSystem().catch((err) => console.log('Error refreshing design systems:', err));
      }

      console.log(data.message)

     
  }catch(err){
      console.log("there was an error with the fetch", err)
  }
      
 }

 {/* ----------------------------------------------------< RETURN JSX >--------------------------------------------------- */} 

 return(
  <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
    <View style={[globalStyles.screenStyles.container, {alignItems: 'center'}]}>
         <ScrollView   
            contentContainerStyle={{  flexDirection: 'column', paddingBottom: 50}}
            keyboardShouldPersistTaps="handled"
            >

{currentSystem?.name && (
  <>
  <Text style={[globalStyles.screenStyles.h3, {color: 'white', textAlign: 'center'}]}>
    {currentSystem.name}
  </Text>
  <Text style={[globalStyles.screenStyles.h5, {color: 'white', textAlign: 'center'}]}>
    {currentSystem.username}
  </Text>
  </>
)}

    {/* ----------------------------------------------------< FONTS >--------------------------------------------------- */} 

    <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Fonts</Text>

    <ScrollView   
      contentContainerStyle={{ flexDirection: 'row' }} // horizontal scroll
      keyboardShouldPersistTaps="handled"
      horizontal
    >
      {/* Check if currentSystem exists and has fonts */}
      {currentSystem?.fonts?.length > 0 ? (
        currentSystem.fonts.map((element, fontIndex) => (
          <View key={`${currentSystem.id}-${fontIndex}`} style={{ marginRight: 20 }}>
            <View style={globalStyles.screenStyles.box}>
              <Text style={[{ fontFamily: element.name, color: 'black', fontSize: 40 }]}>T t</Text>
              <Text style={{ fontFamily: element.name }}>{element.name}</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Pressable onPress={() => handleViewElement(element, "font", currentSystem.id)} style={globalStyles.screenStyles.viewBtn}>
                <Text>View</Text>
              </Pressable>
              <Pressable onPress={() => deleteElement(element, "fonts", currentSystem.id, fontIndex)} style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}>
                <Text>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
         <Pressable onPress={() => addElement("fonts", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
           <MaterialIcons name="add" size={30} color="orange" />
           <Text style={globalStyles.screenStyles.text}>
              Add Element
            </Text>
        </Pressable>
      )}
    </ScrollView>
    
    {/* ----------------------------------------------------< COLORS >---------------------------------------------------  */}  
    
    <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Color Gradients</Text>
    
          <ScrollView   
            contentContainerStyle={{ flexDirection: 'row' }} // row for horizontal scroll
            keyboardShouldPersistTaps="handled"
            horizontal
           >
            {/* Check if currentSystem exists and has gradients */}
            {currentSystem?.gradients?.length > 0 ? (
              currentSystem.gradients.map((element, gradientIndex) => (
                <View key={`${currentSystem.id}-${gradientIndex}`} style={{ marginRight: 20 }}>
                  <LinearGradient
                    style={globalStyles.screenStyles.box}
                    colors={element.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={{ color: '#fff' }}>{element.name}</Text>
                  </LinearGradient>
                  <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Pressable onPress={() => handleViewElement(element, "color", currentSystem.id)} style={globalStyles.screenStyles.viewBtn}>
                      <Text>View</Text>
                    </Pressable>
                    <Pressable onPress={() => deleteElement(element, "gradients", currentSystem.id, gradientIndex)} style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}>
                      <Text>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <Pressable onPress={() => addElement("gradients", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                 <MaterialIcons name="add" size={30} color="orange" />
                 <Text style={globalStyles.screenStyles.text}>
                    Add Element
                  </Text>
              </Pressable>
            )}
          </ScrollView>
    {/* ----------------------------------------------------< TYPOGRAPHY >---------------------------------------------------  */}           
          
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Typography</Text>
          
    <ScrollView
      contentContainerStyle={{ flexDirection: 'row' }}
      keyboardShouldPersistTaps="handled"
      horizontal
    >
      {currentSystem?.typography?.length > 0 ? (
        <View key={`${currentSystem.id}-typography`} style={{ marginRight: 20 }}>
          <View style={globalStyles.screenStyles.box}>
            <Text>Typography Scale</Text>
            <Text style={[{fontWeight: 'bold'}]}>
                {currentSystem.typography[0].name}
             </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Pressable
              onPress={() => handleTypoElement("typography", currentSystem, currentSystem.typography)}
              style={globalStyles.screenStyles.viewBtn}
            >
              <Text>View</Text>
            </Pressable>
            <Pressable
              onPress={() => deleteElement(null, "typography", currentSystem.id)}
              style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}
            >
              <Text>Delete</Text>
            </Pressable> 
          </View>
        </View>
      ) : (
        <Pressable onPress={() => addElement("typography", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                 <MaterialIcons name="add" size={30} color="orange" />
                 <Text style={globalStyles.screenStyles.text}>
                    Add Element
                  </Text>
              </Pressable>
      )}
    </ScrollView>
    
    {/* ----------------------------------------------------< ICONS >---------------------------------------------------  */} 
    
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Icons</Text>
          <ScrollView
            contentContainerStyle={{ flexDirection: 'row' }}
            keyboardShouldPersistTaps="handled"
            horizontal
          >
            {currentSystem?.icons?.length > 0 ? (
              currentSystem.icons.map((icon, index) => (
                <View key={`${icon.id}-${index}`} style={{ marginRight: 10 }}>
                  <View style={globalStyles.screenStyles.box}>
                    <Icon type={icon.name} />
                    <Text>{icon.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Pressable  
                      onPress={() => handleIconElement(icon.name, "icons")} 
                      style={globalStyles.screenStyles.viewBtn}
                    >
                      <Text>View</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteElement(icon, 'icons', currentSystem.id, index)}
                      style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}
                    >
                      <Text>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
                <Pressable onPress={() => addElement("icons", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                    <MaterialIcons name="add" size={30} color="orange" />
                    <Text style={globalStyles.screenStyles.text}>
                       Add Element
                     </Text>
                 </Pressable>
            )}
          </ScrollView>
          
    {/* ----------------------------------------------------< COMPONENTS >---------------------------------------------------  */} 
    <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>Styled Components</Text>
          
          <ScrollView   
            contentContainerStyle={{ flexDirection: 'column' }} 
            keyboardShouldPersistTaps="handled"
            horizontal
          >
            {currentSystem?.comp?.length > 0 ? (
              currentSystem.comp.map((element, index) => {
                // console.log('design screen comp data index 0:', index, ':', element)
                return (
                <View key={index}>
                  <View style={globalStyles.screenStyles.box}>
                    <Text>{element.package}</Text>
                  </View>
              
                  <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Pressable
                      onPress={() => handleCompElement("component", element)}
                      style={globalStyles.screenStyles.viewBtn}
                    >
                      <Text>View</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteElement(element, "comp", currentSystem.id, index)}
                      style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}
                    >
                      <Text>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
            ) : (
                <Pressable onPress={() => addElement("comp", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                  <MaterialIcons name="add" size={30} color="orange" />
                  <Text style={globalStyles.screenStyles.text}>
                     Add Element
                   </Text>
               </Pressable>
            )}
          </ScrollView>
          
    {/* ----------------------------------------------------< OPTIONS >---------------------------------------------------  */} 
          
    <View>
       <Pressable onPress={() => deleteSystem(currentSystem.id)} style={[globalStyles.screenStyles.btn1, {backgroundColor: 'red', color: 'black'}]}>
            <Text style={globalStyles.screenStyles.text}>
              Delete Design System
            </Text>
       </Pressable>
    </View>
          
          
          
        </ScrollView>
          
      </View>
   </SafeAreaView>
      )
    }


export default MyDesignScreen;