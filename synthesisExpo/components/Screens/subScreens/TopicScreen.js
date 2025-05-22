
import globalStyles from '../../../styles';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';



import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';


// Constants makes it so i can access the app.config file in my project from anywhere 
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 


import {
  View, // A container that supports layout with flexbox
  Text, // For displaying text
  TextInput, // For user input text fields
  StyleSheet, // For creating styles similar to CSS
  ScrollView, // Enables scrolling for content that may exceed the screen height
  SectionList, // For rendering a list with grouped data, like a <ul> with <li> 's'
  Image, // For displaying images from local or remote sources
  Modal, // For presenting content over the current view (like alerts or dialogs)
  Picker, // A dropdown component for selecting options <select> <option>
  ActivityIndicator, // For showing loading indicators during asynchronous tasks
  Switch, // A toggle component for binary options (on/off)
  Pressable, // Import Pressable for user interactions
  SafeAreaView,

} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons'; // Import Expo vector icons
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native'


const TopicScreen = ({route}) => {

  const {topic, username} = route.params;
  const [data, setData] = useState(null);
  const [serverFonts, setServerFonts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("")
  const [isChecked, setIsChecked] = useState(false);
  const [selectedElements, setSelectedElements] = useState({
    fonts: [],
    gradients: [],
    typography: [],
    icons: [],
    comp: [],
    name: [],
    about: [],
  });

  // console.log("working ? hello ?", selectedElements)
  // console.log('typography:', data.typography);

  // console.log('username: ', username)

// useEffect(() => {
//   console.log("working ? hello ?", selectedElements)
// }, [selectedElements])



  const navigation = useNavigation();

   const toggleCheck = () => {
     setIsChecked(!isChecked);
   };

 // ------------------------------< Handle Elements >------------------------------------------

   const handleViewElement = (element, type) => {
      navigation.navigate('Element',{element: element, type: type}) 
   }

   const handleIconElement = (iconType) => {
      navigation.navigate('Element', { iconType: iconType, data: data }) 
  }

  const handleCompElement = (type) => {
    navigation.navigate('Element', {type: type, data: data}) 

  }

  // ------------------------------< Toggle Selection >------------------------------------------

  const toggleSelection = (type, element) => {
   // Checks if the new selection is identical to the current state (same length and same labels at each index).
   // If it's identical, clear the selection (toggle off).
   // If it's different, update the selection with the new items.

    setSelectedElements((prevState) => {
      // For name & about (always string)
      if (type === 'name' || type === 'about') {
        return { ...prevState, [type]: [element] };
      }
      
      // basically below, it’s comparing the current selected state (element) with the stored previous state (prevState[type]).
      // so every time it runs false it means there is a discrepancy between both arrays
      
      if (Array.isArray(element)) {
          // Check if the current selected items (prevState[type]) match the new selection (element)
          // checks if every item at each index has the same label.
          // Then it checks if each item at the same position (index) in both arrays has the same label value.
        const isSameAsCurrent = prevState[type].length === element.length && prevState[type].every((item, index) => item.label === element[index].label);
        
         // If the new selection matches the old one exactly, it interprets that as a “deselect”so it clears the selection by returning an empty array [].
        // Otherwise, replace the current selection with the new one
        return {
          ...prevState,
          [type]: isSameAsCurrent ? [] : [...element],
        };
      }
  
      // For single element toggle
      // 	.some() — returns true if any element in the array matches the current one.
      // 	If both item and element have a .label, compare those. Else, if they have .name, compare those.
      const isSelected = prevState[type].some((item) => (item.label && element.label && item.label === element.label) || (item.name && element.name && item.name === element.name));
  
      // [type] dynamic key (used to overwrite this one part of the state)
      // this  ...prevState ----> 
      // {
      //  gradients: [...],
      //  icons: [...],
      //  fonts: [...],
      //   etc: ...
      //   }

      //this [type]: ... ----> gradients: ...
      // ----->  isSelected checks if it was already selected before the click. <------

      //example adding a element
      // type = "gradients"
      // isSelected = false
      // if both these above pass like this it adds a gradient to the selectedItems gradient object state 
     
      return {
        ...prevState, [type]: isSelected ? prevState[type].filter((item) => item.label !== element.label) : [...prevState[type], element],
      };
    });
  };
   

  const fetchUrl = `${apiUrl}/elements?type=${topic}`;
  const fetchHeader = new Headers({'Content-Type': 'application/json'});


  const fetchOptions = {
       method: 'GET',
       headers: fetchHeader,
       mode: 'cors',
       type: topic
     }


  // ------------------------------< Fetch Topic Data >------------------------------------------  

   const fetchCorroData = async () => {

    try{
      const response = await fetch(fetchUrl, fetchOptions);
      let serverData = await response.json();
     
     
      setData(serverData)
      setServerFonts(serverData.fonts)

     }catch(err){
      console.error('Error fetching topic data:', err);   
      }
  };


  
useEffect(() => {
    fetchCorroData();
}, []);


// -----------------------------------< Create/Cancel System >------------------------------------------  

const createSystem = async () =>{

  console.log('typography:', selectedElements.typography);
  
  // console.log('name:', selectedElements.name.length);

  if(selectedElements.comp.length >= 1 && selectedElements.fonts.length >= 1 && selectedElements.gradients.length >= 1 && selectedElements.icons.length >= 1 && selectedElements.typography.length >= 1 && selectedElements.name.length >= 1){
    
    const type = 'designSystem';
    const fetchUrl = `${apiUrl}/save?type=${type}`; 

      // Clean data structure correctly
  const cleanElements = {
    comp: selectedElements.comp,
    fonts: selectedElements.fonts,
    gradients: selectedElements.gradients,
    icons: selectedElements.icons,
    typography: selectedElements.typography.flat(),
    name: selectedElements.name[0] || 'Untitled', // Always just the first name string
    about: selectedElements.about?.[0] || '',     // Always just the first about string 
  };
    

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      mode: 'cors',
      body: JSON.stringify({ ...cleanElements, username }),
     
    };

    try {
      
      const response = await fetch(fetchUrl, fetchOptions);

   
      // if (!response.ok) {
      //   setErrorMessage(`Server responded with status ${response.status}`)
      // }

       const data = await response.json();

       setErrorMessage(data.message); 

       setTimeout(() => {
         navigation.navigate('Tabs', {
          screen: 'Project',
        });
       }, 1000);
      
    } catch (err) {
      console.error('Error saving design system:', err);
      setErrorMessage('Failed to save design system. Please try again.');
    }
  } else {
    setErrorMessage('Make sure you have selected at least 1 element in every section.');
  }
}


const cancelSystem = () => {
  navigation.navigate('Tabs', {
    screen: 'Home',
  });
}

 {/* -----------------------------------------------< RETURN JSX >-----------------------------------------------  */} 
    return(
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={globalStyles.screenStyles.container}>
        <ScrollView 
         
         contentContainerStyle={{  flexDirection: 'column', paddingBottom: 50}}
         keyboardShouldPersistTaps="handled"
         
        >
        <View>
          <Text style={globalStyles.screenStyles.h2}>{topic}</Text>
        </View>
        <Text style={globalStyles.screenStyles.h3}>Recommended Element Styles:</Text>
        <View>

  {/* ----------------------------------------------------< FONTS >---------------------------------------------------  */}
       
      {data && data.fonts && data.fonts.length > 0 && (
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Fonts</Text>
          <ScrollView 
                horizontal // Enables horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
            >
               {data.fonts.map((element, index) => {
                     
                      const matchingFont = element.name;
                     // Check if the font exists in the global styles
                     if (!matchingFont) {
                       return null; // Skip rendering if font isn't found
                     }
       
                return (
                  <View key={index} >
                  <View style={globalStyles.screenStyles.box}>
                   <Pressable onPress={() => toggleSelection('fonts', element)}>
                    <View style={globalStyles.screenStyles.checkCircle}>
                      {selectedElements.fonts.some((item) => item.name === element.name) && ( // this is just matching the circle with the corrospponding element
                        <View style={globalStyles.screenStyles.filledCircle} />
                        )}
                    </View>
                    <Text style={[{ fontFamily: matchingFont, color: 'black', fontSize: 40 }]}>T t</Text>
                   
                    <Text style={{ fontFamily: matchingFont }}>{element.name}</Text>

                    </Pressable>
                </View>
                {/*Instead of passing a reference to the function (handleViewElement(element)), you’re calling it during the render phase, causing it to execute immediately and navigate without waiting for a user click.*/}
                  <Pressable onPress={() => handleViewElement(element, "font")}  style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>
                    );
                  })  
                }  

            </ScrollView>
            </>
          )}
       
         
             
        </View>

  {/* ---------------------------------------------------< COLORS >---------------------------------------------------  */}

  {data && data.gradients && data.gradients.length > 0 && (
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Color Gradients</Text>
          <ScrollView 
               horizontal // Enables horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
            >
              { data.gradients.map((element, index) => {
                  
                return (
                <View key={index}>
                  <Pressable onPress={() => toggleSelection('gradients', element)}>
                    <View style={globalStyles.screenStyles.checkCircle}>
                        {selectedElements.gradients.some((item) => item.name === element.name) && (
                          <View style={globalStyles.screenStyles.filledCircle}></View>
                         )}
                    </View>
                   <LinearGradient
                    key={index} style={globalStyles.screenStyles.box}
                    colors={element.colors} // Array of colors
                     // Adjust style as needed
                    start={{ x: 0, y: 0 }} // Gradient start (top-left)
                    end={{ x: 1, y: 1 }} // Gradient end (bottom-right)
                    >
                  <Text style={{ color: '#fff'}}>{element.name}</Text>
                 
          
                 
                  </LinearGradient>
                 </Pressable>
                <Pressable onPress={() => handleViewElement(element, "color")}   style={globalStyles.screenStyles.viewBtn}>
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

   {data && data.typography && data.typography.length > 0 && (
         
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Typography</Text>
          <ScrollView 
               horizontal // Enables horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
            >
              
               <View>
               <Pressable onPress={() => toggleSelection('typography', data.typography)}>
  <View style={globalStyles.screenStyles.box}>
    <View style={globalStyles.screenStyles.checkCircle}>
      {selectedElements.typography.length > 0 && (
        <View style={globalStyles.screenStyles.filledCircle}></View>
      )}
    </View>
    <Text>Typography Scale</Text>
  </View>
</Pressable>

<Pressable onPress={() => handleCompElement("typography")} style={globalStyles.screenStyles.viewBtn}>
  <Text>View</Text>
</Pressable>
               </View>  
               
             </ScrollView>
            </>
           )}

{/* -----------------------------------------------< ICONS >-----------------------------------------------  */}
       <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Icons</Text>
          <ScrollView 
               horizontal // Enables horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scroll indicator
                contentContainerStyle={globalStyles.screenStyles.scrollContainer} 
            >
              
               <View>
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'feather',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'feather')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                       <Feather name="folder" size={50} color="orange" />
                         <Text >Feather Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement( 'feather')}   style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>

               <View>
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'evil',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'evil')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                       <EvilIcons name="search" size={50} height={50} color="orange" />
                         <Text >Evil Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement( 'evil')}  style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>

               <View >
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'simple',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'simple')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                       <SimpleLineIcons name="folder" size={50} height={50} color="orange" />
                         <Text >SimpleLine Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement( 'simple')}   style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>

               <View>
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'octicons',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'octicons')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                       <Octicons name="repo" size={50} height={50} color="orange" />
                         <Text >Octicons Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement( 'octicons')}   style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>

               <View>
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'ionicons',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'ionicons')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                     <Ionicons name='folder' width={50} height={50} fill="orange" />
                         <Text >Ionicons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement('ionicons')}    style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>

               <View>
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'fontawesome',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'fontawesome')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                  <FontAwesome5 name="folder" size={50} color="orange" />
                  <Text >Fontawesome Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement( 'Fontawesome')}   style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>

               <View>
                  <View style={globalStyles.screenStyles.box}>
                  <Pressable onPress={() => toggleSelection('icons', {name: 'material',})}>
                  <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.icons.some((item) => (item.name === 'material')) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                       <MaterialIcons name="folder" width={50} height={50} fill="orange"/>
                         <Text >Material Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement('material')}  style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
                  </Pressable>
               </View>
               
             </ScrollView>
            </>

   {/* -----------------------------------------------< COMPONENTS >-----------------------------------------------  */}         
       
        {data && data.styledComponents && (
                 <>
                   <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>
                     Styled Components
                   </Text>
                   <ScrollView
                     horizontal
                     showsHorizontalScrollIndicator={false}
                     contentContainerStyle={globalStyles.screenStyles.scrollContainer}
                   >
                     <View>
                       <View style={globalStyles.screenStyles.box}>
                         <Pressable onPress={() => toggleSelection('comp', data.styledComponents)}>
                            <View style={globalStyles.screenStyles.checkCircle}>
                               {selectedElements.comp.some((item) => (item.package === data.styledComponents.package)) && (
                            <View style={globalStyles.screenStyles.filledCircle}></View>
                            )}
                           </View>
                           <Text style={{ fontWeight: 'bold', color: 'black' }}>
                             {data.styledComponents.package}
                           </Text>
                           <Text style={{ color: 'black' }}>Includes components:</Text>
                           {Object.keys(data.styledComponents.components).map((componentName) => (
                             <Text key={componentName} style={{ color: 'orange' }}>
                               {componentName}
                             </Text>
                           ))}
                         </Pressable>
                       </View>
                       <Pressable onPress={() => handleIconElement('component')} style={globalStyles.screenStyles.viewBtn}>
                         <Text>View</Text>
                       </Pressable >
                     </View>
                   </ScrollView>
                 </>
              )}

  {/* -----------------------------------------------< NAMING THE SYSTEM >-----------------------------------------------  */} 

          <View style={[{ justifyContent: 'center', alignItems:'flex-start', margin: 20}]}>
             <Text style={[globalStyles.screenStyles.h4, {color: 'white', marginTop: 20}]}>Name Your Design System</Text>
            <TextInput
                onChangeText={(value) => toggleSelection('name', value)}
                value={selectedElements.name}
                style={[globalStyles.screenStyles.input, {width: '85%' }]}
                placeholder="System Name"
                placeholderTextColor="gray"
                maxLength={15}
            >

            </TextInput>

            <Text style={[globalStyles.screenStyles.h4, {color: 'white', marginTop: 20}]}>Describe Your Design System</Text>

            <TextInput
              onChangeText={(value) => toggleSelection('about', value)}
              value={selectedElements.about}
              style={[globalStyles.screenStyles.input, {width: '85%' }]}
              placeholder="About ( optional )"
              placeholderTextColor="gray"
              maxLength={30}
            >

            </TextInput>

          </View>
          <Text style={{color: 'white'}}>
               {errorMessage}
             </Text>

  {/* -----------------------------------------------< CREATE && CANCEL BTNS >-----------------------------------------------  */} 

          <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}]}>

                 <Pressable onPress={cancelSystem}  style={[globalStyles.screenStyles.btn1, {backgroundColor: 'white', color: 'black'}]}>
                    <Text>Cancel</Text>
                  </Pressable>

                  <Pressable onPress={createSystem} style={[globalStyles.screenStyles.btn1, {backgroundColor: 'orange', color: 'white'}]}>
                    <Text>Create</Text>
                  </Pressable>
             
          </View>

         </ScrollView>
      </View>
  </SafeAreaView>  
    )
  }



export default TopicScreen;