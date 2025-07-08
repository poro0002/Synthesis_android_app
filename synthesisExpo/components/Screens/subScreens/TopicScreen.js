
import globalStyles from '../../../styles';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';



import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import LottieView from 'lottie-react-native';

import VideoBackground from '../Bkgd/VideoBackground'; 
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Constants makes it so i can access the app.config file in my project from anywhere 
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import { useAuth } from '../../../LogContext'; 


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

  const {topic} = route.params;
  
  const { 
    username, 
    getUpdatedUsername, 
    setSelectedElements, 
    selectedElements, 
    createSystem, 
    errorMessage, 
    setErrorMessage, 
    toggleSelection,
    handleViewElement,
    handleIconElement,
    handleTypoElement,
    handleCompElement,
    loading,
   
  
  } = useAuth();

   const headerHeight = useHeaderHeight();
    const navigation = useNavigation();
   

  const [data, setData] = useState(null);
  const [serverFonts, setServerFonts] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  
  // You cannot update state during the rendering phase of a different component. has to be in a useEffect
  useEffect(() => {

    setErrorMessage('');
    
    setSelectedElements({
      fonts: [],
      gradients: [],
      typography: [],
      icons: [],
      comp: [],
      name: [],
      about: [],
    });

  }, []);



  // console.log('typography:', data.typography);

  // console.log('topic screen username: ', username)
  // console.log('topic screen data', JSON.stringify(data, null, 2))

//  useEffect(() => {
//   console.log("Selected Elements on topic screen(logContext):\n", JSON.stringify(selectedElements, null, 2));
//  }, [selectedElements])



   useEffect(() => {
     getUpdatedUsername();
   }, [])




const handleCreate = async () => {
 
  const success = await createSystem();
  
  if (success) {     
    setTimeout(() => {
      navigation.navigate('Tabs', { screen: 'Project' });
    }, 1000); 

  }
};



   const toggleCheck = () => {
     setIsChecked(!isChecked);
   };

  //  console.log('topic screen typo data:', data?.typography)
  //  console.log('topic screen comp data:', data?.styledComponents)


   

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
      // console.log('topic screen fetched data:', data)
      setServerFonts(serverData.fonts)

     }catch(err){
      console.error('Error fetching topic data:', err);   
      }
  };


  
useEffect(() => {
    fetchCorroData();
}, []);


const cancelSystem = () => {
  navigation.navigate('Tabs', {
    screen: 'Home',
  });
}

 {/* -----------------------------------------------< RETURN JSX >-----------------------------------------------  */} 
    return( 
      loading ? (     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
             source={require('../../../assets/loading1.json')}
             autoPlay
             loop
             style={{ width: 100, height: 100, alignSelf: 'center'}}
           />
        <Text>Creating System....</Text>
      </View>):

    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{flex: 1, position: 'relative', alignItems: 'center', zIndex: 0}}>
      <ImageBackground
            source={require('../../../assets/purple-gradient.jpg')}
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

       <View style={{ flex: 1, zIndex: 1, padding: 20, }}>
      
     <KeyboardAwareScrollView
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: headerHeight }}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}   // hide vertical scrollbar
        showsHorizontalScrollIndicator={false} // hide horizontal scrollbar
      >

        <View>
          <Text style={[globalStyles.screenStyles.h2, globalStyles.screenStyles.textShadow, {textTransform: 'uppercase'}]}>{topic}</Text>
        </View>
        <Text style={globalStyles.screenStyles.h3}>Recommended Element Styles:</Text>
        <View>

  {/* ----------------------------------------------------< FONTS >---------------------------------------------------  */}
       
      {data && data.fonts && data.fonts.length > 0 && (
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Fonts ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
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
                    <Text style={[{ fontFamily: matchingFont, color: 'white', fontSize: 40 }]}>T t</Text>
                   
                    <Text style={{ fontFamily: matchingFont, color: 'white', }}>{element.name}</Text>

                    </Pressable>
                </View>
                {/*Instead of passing a reference to the function (handleViewElement(element)), you’re calling it during the render phase, causing it to execute immediately and navigate without waiting for a user click.*/}
                  <Pressable onPress={() => handleViewElement(navigation, element, "font")}  style={globalStyles.screenStyles.viewBtn}>
                    <Text style={{  color: 'white'}}>View</Text>
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
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Color Gradients ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
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
                <Pressable onPress={() => handleViewElement(navigation, element, "color")}   style={globalStyles.screenStyles.viewBtn}>
                     <Text style={{  color: 'white'}}>View</Text>
                  </Pressable>
               </View>
                );
                  })  
                }  

             </ScrollView>
            </>
          )}


  {/* -----------------------------------------------< TYPOGRAPHY >-----------------------------------------------  */}

   {data && data.typography && data.typography.styles && data.typography.styles.length > 0 && (
         
      <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Typography ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
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
                        <Text style={{  color: 'white', fontSize: 12}}>Typography Scale</Text>
                        <Text style={[{fontWeight: 'bold', color: 'white'}]}>
                            {data.typography.name}
                        </Text>
                      </View>
                    </Pressable>
                        
                    <Pressable onPress={() => handleTypoElement(navigation, "typography", data.typography)} style={globalStyles.screenStyles.viewBtn}>
                       <Text style={{  color: 'white'}}>View</Text>
                    </Pressable>
               </View>  
               
             </ScrollView>
            </>
           )}

{/* -----------------------------------------------< ICONS >-----------------------------------------------  */}
       <>
        <Text style={[globalStyles.screenStyles.h4, {color: 'white'}]}>Icons ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</Text>
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
                       <Feather name="folder" size={50} color="royalblue" />
                         <Text style={{  color: 'white'}}>Feather Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'feather', "icons")}   style={globalStyles.screenStyles.viewBtn}>
                        <Text style={{  color: 'white'}}>View</Text>
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
                       <EvilIcons name="search" size={50} height={50} color="royalblue" />
                         <Text style={{  color: 'white'}}>Evil Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'evil', "icons")}  style={globalStyles.screenStyles.viewBtn}>
                    <Text style={{  color: 'white'}}>View</Text>
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
                       <SimpleLineIcons name="folder" size={50} height={50} color="royalblue" />
                         <Text style={{  color: 'white'}}>SimpleLine Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'simple', "icons")}   style={globalStyles.screenStyles.viewBtn}>
                       <Text style={{  color: 'white'}}>View</Text>
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
                       <Octicons name="repo" size={50} height={50} color="royalblue" />
                         <Text style={{  color: 'white'}}>Octicons Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'octicons', "icons")}   style={globalStyles.screenStyles.viewBtn}>
                    <Text style={{  color: 'white'}}>View</Text>
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
                     <Ionicons name="folder" size={50} color="royalblue" />
                         <Text style={{  color: 'white'}}>Ionicons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'ionicons', "icons")}    style={globalStyles.screenStyles.viewBtn}>
                     <Text style={{  color: 'white'}}>View</Text>
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
                  <FontAwesome5 name="folder" size={50} color="royalblue" />
                  <Text style={{  color: 'white'}}>Fontawesome Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'Fontawesome', "icons")}   style={globalStyles.screenStyles.viewBtn}>
                     <Text style={{  color: 'white'}}>View</Text>
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
                     <MaterialIcons name="folder" size={50} color="royalblue" />
                         <Text style={{  color: 'white'}}>Material Icons</Text>
                    </Pressable>
                </View>
                  <Pressable onPress={() => handleIconElement(navigation, 'material', "icons")}  style={globalStyles.screenStyles.viewBtn}>
                     <Text style={{  color: 'white'}}>View</Text>
                  </Pressable>
               </View>
               
             </ScrollView>
            </>

   {/* -----------------------------------------------< COMPONENTS >-----------------------------------------------  */}         
       
        {data && data.styledComponents && (
                 <>
                   <Text style={[globalStyles.screenStyles.h4, { color: 'white' }]}>
                     Styled Components ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
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
                           <Text style={{ fontWeight: 'bold', color: 'white' }}>
                             {data.styledComponents.package}
                           </Text>
                           <Text style={{ color: 'white', fontSize: 12 }}>Includes components:</Text>
                           {Object.keys(data.styledComponents.components).map((componentName) => (
                             <Text key={componentName} style={{ color: 'royalblue' }}>
                               {componentName}
                             </Text>
                           ))}
                         </Pressable>
                       </View>
                       <Pressable onPress={() => handleCompElement(navigation, 'component', data.styledComponents)} style={globalStyles.screenStyles.viewBtn}>
                           <Text style={{  color: 'white'}}>View</Text>
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
                style={[globalStyles.screenStyles.input, {width: '100%', borderColor: 'white', }]}
                placeholder="System Name"
                placeholderTextColor="gray"
                maxLength={15}
            >

            </TextInput>

            <Text style={[globalStyles.screenStyles.h4, {color: 'white', marginTop: 20}]}>Describe Your Design System</Text>

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
            <Text style={[globalStyles.screenStyles.textShadow, { color: 'orange', textAlign: 'center', marginVertical: 10 }]}>
                {errorMessage}
             </Text>
            ) : null}

  {/* -----------------------------------------------< CREATE && CANCEL BTNS >-----------------------------------------------  */} 

          <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems:'center', marginTop: 30}]}>

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
  </SafeAreaView>  
    )
  }



export default TopicScreen;