
import globalStyles from '../../../styles';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';



import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';






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
  Pressable // Import Pressable for user interactions
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


  console.log('username: ', username)

// useEffect(() => {
//   console.log(selectedElements)
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
    setSelectedElements((prevState) => { // using the set use state as an arrow function ( functional update form)
      // this is built into the use states correct as the are a function that usually 
      // just takes a value but you can extent its syntax to choose specific things to sent depending on functionality
  
      // Handle 'name' and 'about' as strings instead of an object (selectedElements({}))
      if (type === 'name' || type === 'about') {
        return {

          //the "prevstate" param is the pre-existing state of the use state variable correct which is then spread so you can add onto without having to completely redo it 
          ...prevState,
          [type]: [element], 
          // and to add it to this object you have to address it the same way as the others, the type example "comp" :  [new element]
        };
      }
  
      // Handle other types as arrays of objects
      const currentSelections = prevState[type] || [];
      const isSelected = currentSelections.find((item) => item.name === element.name);
  
      if (isSelected) {
        // Remove the element from the list
        return {
          ...prevState,
          [type]: currentSelections.filter((item) => item.name !== element.name),
        };
      } else {
        // Add the element to the list
        return {
          ...prevState,
          [type]: [...currentSelections, element],
        };
      }
    });
  };
   

  const fetchUrl = `http://10.0.2.2:4500/elements?type=${topic}`; //
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

// ------------------------------< Create/Cancel System >------------------------------------------  

const createSystem = async () =>{

  console.log('Checking Fields:');
  console.log('comp:', selectedElements.comp.length);
  console.log('fonts:', selectedElements.fonts.length);
  console.log('gradients:', selectedElements.gradients.length);
  console.log('icons:', selectedElements.icons.length);
  console.log('typography:', selectedElements.typography.length);
  console.log('name:', selectedElements.name.length);

  if(selectedElements.comp.length >= 1 && selectedElements.fonts.length >= 1 && selectedElements.gradients.length >= 1 && selectedElements.icons.length >= 1 && selectedElements.typography.length >= 1 && selectedElements.name.length >= 1){
    
    const type = 'designSystem';
    const fetchUrl = `http://10.0.2.2:4500/save?type=${type}`; 
    
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      mode: 'cors',
      body: JSON.stringify({ ...selectedElements, username }),
     
    };

    try {
      const response = await fetch(fetchUrl, fetchOptions);

   
      if (!response.ok) {
        setErrorMessage(`Server responded with status ${response.status}`)
      }

       const data = await response.json();

       setErrorMessage(data.message); 
       setTimeout(() => {
        navigation.navigate("Project");
       }, 1000);
      //  navigation.navigate('Home'); 
    } catch (err) {
      console.error('Error saving design system:', err);
      setErrorMessage('Failed to save design system. Please try again.');
    }
  } else {
    setErrorMessage('Make sure you have selected at least 1 element in every section.');
  }
}


const cancelSystem = () => {
  navigation.navigate("Home")
}


    return(
      <View style={globalStyles.screenStyles.container}>
        <ScrollView 
         
         contentContainerStyle={{  flexDirection: 'column'}}
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
               { data.fonts.map((element, index) => {
                     
                      const matchingFont = element.name;
                     // Check if the font exists in the global styles
                     if (!matchingFont) {
                       return null; // Skip rendering if font isn't found
                     }
       
                return (
                  <View>
                  <View key={index} style={globalStyles.screenStyles.box}>
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
                <View>
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
               <Pressable onPress={() => toggleSelection('typography', data.typography[0])}>
                  <View style={globalStyles.screenStyles.box}>
                     <View style={globalStyles.screenStyles.checkCircle}>
                       {selectedElements.typography.some((item) => (item.name === data.typography[0].name)) && (
                         <View style={globalStyles.screenStyles.filledCircle}></View>
                       )}
                     </View>
                
                    <Text>Typography Scale</Text>
                    
                </View>
                </Pressable>
                  <Pressable onPress={() => handleCompElement("typography")}   style={globalStyles.screenStyles.viewBtn}>
                    <Text >View</Text>
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
                style={[globalStyles.screenStyles.input, {width: 400 }]}
                placeholder="System Name"
                placeholderTextColor="gray"
                maxLength={15}
            >

            </TextInput>

            <Text style={[globalStyles.screenStyles.h4, {color: 'white', marginTop: 20}]}>Describe Your Design System</Text>

            <TextInput
              onChangeText={(value) => toggleSelection('about', value)}
              value={selectedElements.about}
              style={[globalStyles.screenStyles.input, {width: 400 }]}
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
    )
  }



export default TopicScreen;