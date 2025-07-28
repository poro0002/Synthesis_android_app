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
  Alert
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'
import VideoBackground from '../Bkgd/VideoBackground'; 
import { useHeaderHeight } from '@react-navigation/elements';
import { ImageBackground } from 'react-native';

import Icon from './Icon'
import { useAuth } from '../../../LogContext'; 

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 


const MyDesignScreen = ({route}) => {
  const { data } = route?.params || {}; // we now get data from the react context pattern
    // console.log("data:", data);



  const { 
    designSystemData, 
    getDesignSystem, 
    setDesignSystemData,
    handleViewElement,
    handleIconElement,
    handleTypoElement,
    handleCompElement,
    username,

  } = useAuth();

  const [selectedIndex, setSelectedIndex] = useState(0); // Defaults to showing the first design system
  const [currentSystem, setCurrentSystem] = useState(data); // keep this
  const [localLoading, setLocalLoading] = useState(false);

   const gradientColors = currentSystem.gradients.length > 0 ? currentSystem.gradients[0].colors : ['#4c4c66', '#1a1a2e']; 



  // console.log('design screen current system', currentSystem)

  // console.log('design screen typo data:', [currentSystem.typography[0]])
 

  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

// useEffect(()=>{
//   console.log('what screen is this ')

// }, [])



useFocusEffect(
  useCallback(() => {
    console.log('Screen focused. (myDesignScreen) Refetching design system...');
    //  console.log('current system:', currentSystem);
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

  // console.log('updatedSystem:', updatedSystem)

  if (updatedSystem) {
   setCurrentSystem({ ...updatedSystem });
 
  }
}, [designSystemData]);


{/* ----------------------------------------------------< ADD Element  >--------------------------------------------------- */} 

const addElement = (category, systemId) =>{
  // add element functionality after i fix this delete element issues
  //  console.log("Navigating to PickElementScreen with category:", category, "and systemId:", systemId);

  navigation.navigate('PickElementScreen', {
    category: category,
    systemId: systemId,
    // username: currentSystem.username
  });

}

{/* ----------------------------------------------------< Delete Corro TokenJSON  >--------------------------------------------------- */} 

 const deleteTokenJson = async (systemId) => {
  

    const fetchURL = `${apiUrl}/deleteTokenJson`;
    const fetchHeaders = new Headers({'Content-Type': 'application/json'});

    const fetchOptions = {
        method: "POST",
        headers: fetchHeaders,
        mode: 'cors',
        body: JSON.stringify({
          username: currentSystem.username,
          systemId: systemId,
       
        })
    }


   try{
        let response = await fetch(fetchURL, fetchOptions);

        let data = await response.json();

        if(data.success){
          console.log(data.message)
        }else{
          console.log(data.message)
        }

     

       
    }catch(err){
        console.log("there was an error with the deleteTokenJson fetch", err)
    } 

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
    setLocalLoading(true);
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
    } finally {
      setLocalLoading(false);
    }
 }


 {/* ----------------------------------------------------< Export System >--------------------------------------------------- */} 


 const exportSystem = async (id) =>{

   // send the username, email and current system id to the backend via body 
    setLocalLoading(true)
      const fetchURL = `${apiUrl}/getTokenJson`;
      const fetchHeaders = new Headers({'Content-Type': 'application/json'});
      const email = await AsyncStorage.getItem('email');

      const fetchOptions = {
          method: "POST",
          headers: fetchHeaders,
          mode: 'cors',
          body: JSON.stringify({
            username,
            email,
            id
          })
      }
    
      try{
         console.log("export system btn pressed")
        let response = await fetch(fetchURL, fetchOptions);
      
        let data = await response.json();
      
        if(data.success){
        
           console.log(data.message)
          Alert.alert(
            "Success",
            "JSON data has been sent to your email.",
            [{ text: "OK" }]
          );
        }else{
        
           console.log(data.message)
            Alert.alert(
            "Failed",
            "Please Try Again Later",
            [{ text: "OK" }]
          );
        }
      
      }catch(err){
         console.log("there was an error with the fetch", err)
      }
       finally {
        setLocalLoading(false);
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


  Alert.alert(
    "Delete Design System",
    "are you sure you want to delete this design system ?",
     [
    { text: "Cancel", style: "cancel" },
    { text: "OK", onPress: async () =>  {

        try{
          console.log('Calling deleteTokenJson with:', id);

           await deleteTokenJson(id);
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
    }}
  ]

  )  
 }

 {/* ----------------------------------------------------< RETURN JSX >--------------------------------------------------- */} 

 return(
  <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
     
      {localLoading && (
          <Modal transparent={true} animationType="fade">
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <ActivityIndicator size="large" color="white" />
              <Text style={{ color: 'white', marginTop: 10 }}>Processing...</Text>
            </View>
          </Modal>
      )}


     <View style={{flex: 1, position: 'relative', alignItems: 'center', padding: 20, zIndex: 0}}>

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

     
           
        <View style={{ flex: 1, zIndex: 1,}}>
         <ScrollView   
            contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false} 
            showsHorizontalScrollIndicator={false}
            >

      {currentSystem?.name && (
        <View style={{marginTop: 20, marginBottom: 50}}>
        <Text style={[globalStyles.screenStyles.h3, globalStyles.screenStyles.textShadow,  {color: 'white', textAlign: 'center'}]}>
          {currentSystem.name}
        </Text>
        <Text style={[globalStyles.screenStyles.h5, {color: 'white', textAlign: 'center'}]}>
          {currentSystem.username}
        </Text>
        </View>
      )}

    {/* ----------------------------------------------------< FONTS >--------------------------------------------------- */} 

 <View style={globalStyles.screenStyles.container}>
    <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, {color: 'white'}]}>Fonts</Text>

    <ScrollView   
      contentContainerStyle={{ flexDirection: 'row', marginBottom: 40 }} // horizontal scroll
      keyboardShouldPersistTaps="handled"
      horizontal
      
    >
      {/* Check if currentSystem exists and has fonts */}
      {currentSystem?.fonts?.length > 0 ? (
        currentSystem.fonts.map((element, fontIndex) => (
          <View key={`${currentSystem.id}-${fontIndex}`} style={{ marginRight: 20 }}>
            <View style={globalStyles.screenStyles.box}>
              <Text style={[{ fontFamily: element.name, color: 'white', fontSize: 40 }]}>T t</Text>
              <Text style={{ fontFamily: element.name, color: 'white' }}>{element.name}</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Pressable onPress={() => handleViewElement(navigation, element, "font")} style={globalStyles.screenStyles.viewBtn}>
                <Text style={{color: 'white'}}>View</Text>
              </Pressable>
              <Pressable onPress={() => deleteElement(element, "fonts", currentSystem.id, fontIndex)} style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red',   }]}>
                <Text style={{color: 'white'}}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
         <Pressable onPress={() => addElement("fonts", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
           <MaterialIcons name="add" size={30} color="royalblue" />
           <Text style={globalStyles.screenStyles.text}>
              Add Element
            </Text>
        </Pressable>
      )}
    </ScrollView>
    </View>
    
    {/* ----------------------------------------------------< COLORS >---------------------------------------------------  */}  
    <View style={globalStyles.screenStyles.container}>
       <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, {color: 'white'}]}>Color Gradients</Text>
    
          <ScrollView   
            contentContainerStyle={{ flexDirection: 'row', marginBottom: 40  }} // row for horizontal scroll
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
                    <Pressable onPress={() => handleViewElement(navigation, element, "color")} style={globalStyles.screenStyles.viewBtn}>
                    <Text style={{color: 'white'}}>View</Text>
                    </Pressable>
                    <Pressable onPress={() => deleteElement(element, "gradients", currentSystem.id, gradientIndex)} style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}>
                      <Text style={{color: 'white'}}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <Pressable onPress={() => addElement("gradients", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                 <MaterialIcons name="add" size={30} color="royalblue" />
                 <Text style={globalStyles.screenStyles.text}>
                    Add Element
                  </Text>
              </Pressable>
            )}
          </ScrollView>

      </View>

    {/* ----------------------------------------------------< TYPOGRAPHY >---------------------------------------------------  */}           
    <View style={globalStyles.screenStyles.container}>     
      <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, { color: 'white' }]}>Typography</Text>
            
      <ScrollView
        contentContainerStyle={{ flexDirection: 'row', marginBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        horizontal
      >
      {currentSystem?.typography?.length > 0 ? (
        <View key={`${currentSystem.id}-typography`} style={{ marginRight: 20 }}>
          <View style={globalStyles.screenStyles.box}>
            <Text style={{color: 'white'}}>Typography Scale</Text>
            <Text style={[{fontWeight: 'bold', color: 'white'}]}>
                {currentSystem.typography[0].name}
             </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Pressable
              onPress={() => handleTypoElement(navigation, "typography", currentSystem.typography[0])}
              style={globalStyles.screenStyles.viewBtn}
            >
              <Text style={{color: 'white'}}>View</Text>
            </Pressable>
            <Pressable
              onPress={() => deleteElement(null, "typography", currentSystem.id)}
              style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red' }]}
            >
              <Text style={{color: 'white'}}>Delete</Text>
            </Pressable> 
          </View>
        </View>
      ) : (
        <Pressable onPress={() => addElement("typography", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                 <MaterialIcons name="add" size={30} color="royalblue" />
                 <Text style={globalStyles.screenStyles.text}>
                    Add Element
                  </Text>
              </Pressable>
      )}
     </ScrollView>
    </View>
    
    {/* ----------------------------------------------------< ICONS >---------------------------------------------------  */} 
   <View style={globalStyles.screenStyles.container}>  
    <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, { color: 'white' }]}>Icons </Text>
          <ScrollView
            contentContainerStyle={{ flexDirection: 'row', marginBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            horizontal
          >
            {currentSystem?.icons?.length > 0 ? (
              currentSystem.icons.map((icon, index) => (
                <View key={`${icon.id}-${index}`} style={{ marginRight: 10 }}>
                  <View style={globalStyles.screenStyles.box}>
                    <Icon type={icon.name} />
                    <Text style={{color: 'white'}}>{icon.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Pressable  
                      onPress={() => handleIconElement(navigation, icon.name, "icons")} 
                      style={globalStyles.screenStyles.viewBtn}
                    >
                     <Text style={{color: 'white'}}>View</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteElement(icon, 'icons', currentSystem.id, index)}
                      style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red'}]}
                    >
                      <Text style={{color: 'white'}}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
                <Pressable onPress={() => addElement("icons", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                    <MaterialIcons name="add" size={30} color="royalblue" />
                    <Text style={globalStyles.screenStyles.text}>
                       Add Element
                     </Text>
                 </Pressable>
            )}
          </ScrollView>
       </View>    
    {/* ----------------------------------------------------< COMPONENTS >---------------------------------------------------  */} 

  <View style={globalStyles.screenStyles.container}> 
    <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, { color: 'white' }]}>Styled Components</Text>
          
          <ScrollView   
            contentContainerStyle={{ flexDirection: 'row', marginBottom: 40 }} 
            keyboardShouldPersistTaps="handled"
            horizontal
          >
            {currentSystem?.comp?.length > 0 ? (
              currentSystem.comp.map((element, index) => {
                // console.log('design screen comp data index 0:', index, ':', element)
                return (
                <View key={index}>
                  <View style={globalStyles.screenStyles.box}>
                    <Text style={{color: 'white'}}>{element.package}</Text>
                  </View>
              
                  <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Pressable
                      onPress={() => handleCompElement(navigation, "component", element)}
                      style={globalStyles.screenStyles.viewBtn}
                    >
                      <Text style={{color: 'white'}}>View</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteElement(element, "comp", currentSystem.id, index)}
                      style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'red'}]}
                    >
                      <Text style={{color: 'white'}}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
            ) : (
                <Pressable onPress={() => addElement("comp", currentSystem.id)} style={globalStyles.screenStyles.centerRow}>
                  <MaterialIcons name="add" size={30} color="royalblue" />
                  <Text style={globalStyles.screenStyles.text}>
                     Add Element
                   </Text>
               </Pressable>
            )}
          </ScrollView>
      </View>     
    {/* ----------------------------------------------------< OPTIONS >---------------------------------------------------  */} 
       <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <MaterialIcons name="warning" size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 10, marginRight: 10,  flexShrink: 1,  flexWrap: 'wrap'}}>  
                If you want to add multiple styles to category a after the system has been initialized, it may require rebuilding the design system
           </Text>
        </View>

        <Pressable onPress={() => exportSystem(currentSystem.id)} style={[globalStyles.screenStyles.btnShadow, {backgroundColor: 'royalblue', borderRadius: 10,  height: 70, alignItems: 'center', justifyContent: 'center', marginVertical: 20 }]}>
            <Text style={globalStyles.screenStyles.text}>
              Export 
            </Text>
         </Pressable>

          

       <Pressable onPress={() => deleteSystem(currentSystem.id)} style={[globalStyles.screenStyles.btnShadow, {backgroundColor: 'red', borderRadius: 10,  height: 70, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={globalStyles.screenStyles.text}>
              Delete 
            </Text>
       </Pressable>
       

          
          
          
        </ScrollView>
        </View>
      </View>
   </SafeAreaView>
      )
    }


export default MyDesignScreen;