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

import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';

import Icon from './Icon'
import { useAuth } from '../../../LogContext'; 
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import { useNavigation } from '@react-navigation/native'
import VideoBackground from '../Bkgd/VideoBackground'; 
import { useHeaderHeight } from '@react-navigation/elements';


const ElementScreen = ({ route }) => {

  let { element, type, iconType, data, screenType } = route.params;

   const navigation = useNavigation();
   const headerHeight = useHeaderHeight();


  //  console.log('element screen data', JSON.stringify(data, null, 2))
  //  console.log('element screen element', JSON.stringify(element, null, 2))
  // console.log('element screen element:', element) // font, 
  // console.log(' element screen iconType:', iconType)
  // console.log('element screen  type:', type)
  // console.log('element screen data:', data)

  const { username, getUpdatedUsername, checkFavorites, getPayloadData } = useAuth();
  // theoretically, this needs to fetch check if the current element is already in the favorites or not because choosing what is true of false
  const [selectedFavBtn, setSelectedFavBtn] = useState(null);

  
  // icon isn't initially changed through the params so if thats whats being displayed it needs to be manually set 
  if (iconType && type !== "styledComponents") {
    type = "icon";
  }


  useEffect(() => {
    getUpdatedUsername();
  }, [])





  // check favorites needs to return true or false so the icon can fill or not
  useEffect(() =>{

    console.log('useEffect fired in ElementScreen');
    
    const check = async () => {
      const payload = getPayloadData({element, type, iconType, data});
      const isFavorite = await checkFavorites(payload); 
      setSelectedFavBtn(isFavorite); 
    };
  
    check();
  }, []);




// ---------------------------------------------------------< SAVE FAVORITE >---------------------------------------------------------

// write this functionality and make sure each type saves a consistent data structure that can be fetched and displayed easily


  const saveFavorite =  async (data) =>{
      const fetchURL = `${apiUrl}/saveFavorite`
      const fetchHeaders = new Headers({'Content-Type':'application/json'})

      let payload = getPayloadData({ type, data, element, iconType });

      const fetchOptions = {
        method: 'POST',
        mode: 'cors',
        headers: fetchHeaders,
        body: JSON.stringify({
          type,
          username,
          payload,
        }),
      }

      try{  
          let response = await fetch(fetchURL, fetchOptions );

          let data = await response.json();

          if(data.success){
            console.log(data.message)
            
          }else{
            console.log(data.message)
          }
     
      }catch(err){
         console.log('there was an error with the fetch', err)
      }
  


  }

  // ---------------------------------------------------------< REMOVE FAVORITE >---------------------------------------------------------


// this function may have to be moved to the longContext file so it can be used on multiple screens for further scalability 

// lets work on this today 

const removeFav = async (data, element) => {
    
  let payload = getPayloadData({ type, data, element, iconType });
  
    const fetchURL = `${apiUrl}/deleteFavorite`
    const fetchHeaders = new Headers({'Content-Type':'application/json'})


    const fetchOptions = {
      method: 'DELETE',
      mode: 'cors',
      headers: fetchHeaders,
      body: JSON.stringify({
        type,
        username,
        payload,
       
      })
    }
    
    try{

      const response = await fetch(fetchURL, fetchOptions)

      let data = await response.json();

      if(data.success){
        console.log(data.message)
        setSelectedFavBtn(false)
      }


    }catch(err){
      console.log('something went wrong with the /deleteElement fetch');
    }

    
}


  let alpha = "Aa | Bb | Cc | Dd | Ee | Ff | Gg |  Hh | Ii | Jj | Kk | Ll | Mm | Nn | Oo | Pp | Qq | Rr | Ss | Tt | Uu | Vv | Ww | Xx | Yy | Zz" 
  
  // btn
  let btnBorder;
  let btnBorderRadius;
  let btnBoxShadow;
  let btnMargin;
  let btnPadding;

  // card
  let cardBorder;
  let cardBorderRadius;
  let cardBoxShadow;
  let cardLayout;
  let cardDir;
  let cardPadding;

  const packageName = data?.package ?? 'Unknown Package'; // ?? uses a fallback "Unknown Package" if the data doesn't exist

  if (type === "component" && data?.components) {
    try {
      btnBorder = data.components.button.styles.borderWidth + ' ' + data.components.button.styles.borderColor;
      btnBorderRadius = data.components.button.styles.borderRadius;
      btnBoxShadow = `${data.components.button.styles.shadowOffset.width} ${data.components.button.styles.shadowOffset.height} ${data.components.button.styles.shadowRadius} ${data.components.button.styles.shadowColor}`;
      btnMargin = data.components.button.styles.margin
      btnPadding = `${data.components.button.styles.paddingVertical} ${data.components.button.styles.paddingHorizontal}`;

      cardBorder = data.components.card.styles.borderWidth + ' ' + data.components.card.styles.borderColor;
      cardBorderRadius = data.components.card.styles.borderRadius;
      cardBoxShadow = `${data.components.card.styles.shadowOffset.width} ${data.components.card.styles.shadowOffset.height} ${data.components.card.styles.shadowRadius} ${data.components.card.styles.shadowColor}`;
      cardLayout = 'flex';
      cardDir = data.components.card.styles.flexDirection;
      cardPadding = data.components.card.styles.padding;
    } catch (error) {
      console.log("Error accessing styled components:", error);
      return <Text style={{ color: 'red' }}>Error accessing styled components data.</Text>;
    }
  }



  // ---------------------------------------------------------< RETURN JSX >---------------------------------------------------------

  return (
     <View style={{flex: 1, position: 'relative', alignItems: 'center', padding: 20, zIndex: 0}}>
                      <ImageBackground
                           source={require('../../../assets/dark-blue-gradient.jpg')}
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
         <View style={{ flex: 1, zIndex: 1 }}>
        
        <ScrollView   
                  contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight,}}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false} 
                  showsHorizontalScrollIndicator={false}
                  >
      
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>   
      <Pressable onPress={ async () => { 
           
           if (selectedFavBtn) {
            await removeFav(data, element, screenType);
            setSelectedFavBtn(false);
          } else {
            await saveFavorite(data);
            setSelectedFavBtn(true);
          }
           }}>
            {selectedFavBtn ? (
               <MaterialIcons name='favorite' style={globalStyles.screenStyles.iconShadow} size={50} color='royalblue'></MaterialIcons>
            ):
            (
              <MaterialIcons name='favorite-border' style={globalStyles.screenStyles.iconShadow} size={50} color='royalblue'></MaterialIcons>
            )
          }
            
        </Pressable>
      </View>
      {type === "font" && (
         <View style={globalStyles.screenStyles.centerColumn}>
          <View style={{marginBottom: 15 }}>
             <Text style={[globalStyles.screenStyles.textShadow,{ color: 'white', fontSize:  40, fontFamily: element.name }]}>{element.name}</Text>
             <Text style={[{ color: 'white', fontSize:  20, textAlign: 'center' }]}>Example</Text>
             

          </View>

          <View style={globalStyles.screenStyles.fontCard}>
                <Text style={{fontSize:  18, fontWeight: 'bold', color: 'white', marginBottom: 15}}>All Characters: </Text>
                <Text style={[{ color: 'white', fontSize:  20, fontFamily: element.name }]}> {alpha}</Text>
             </View>

             <View style={globalStyles.screenStyles.fontCard}>
                <Text style={[{ color: 'white', fontSize:  15, fontFamily: element.name }]}><Text style={{fontSize:  18, fontWeight: 'bold'}}>Example Text: </Text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
             </View>


             <View style={globalStyles.screenStyles.fontCard}>
                <Text style={[{ color: 'white', marginBottom: 10, fontSize:  15  }]}><Text style={{fontSize:  18, fontWeight: 'bold'}}>Designer: </Text> {element.designer}</Text>
                <Text style={[{ color: 'white', fontSize:  15, marginBottom: 10  }]}> <Text style={{fontSize:  18, fontWeight: 'bold'}}>Info: </Text>  {element.description}</Text>
                <Text style={[{ color: 'white', fontSize:  15, marginBottom: 10 }]}><Text style={[{fontWeight: 'bold'}]}>CSS URI:</Text> {element.uri}</Text>
               
               
             </View>
           
          </View>
        
      )}

      {type === "color" && (
        // make the a view div that has the whole gradient color in it 
        // also show smaller examples of each of the primary and secondaries/ect. 
        // then do an about section for the gradient 

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{  flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={[globalStyles.screenStyles.textShadow, { color: 'white', fontStyle: 'italic', fontSize: 40, marginBottom: 15, }]}>{element.name}</Text>
                <Text  style={[{ color: 'white', fontSize:  20 }]}>Example</Text>
                <Text style={{backgroundColor: 'transparent', borderRadius: 5, padding: 20, color: 'white', textAlign: 'center'}}>{element.description}</Text>
              </View>

              <LinearGradient
                    style={[globalStyles.screenStyles.box, {width: 300, height: 100, marginTop: 25, borderColor: '#fff',  borderWidth: 1, borderRadius: 4, }]}
                    colors={element.colors} // Array of colors
                    
                    start={{ x: 0, y: 0 }} // Gradient start (top-left)
                    end={{ x: 1, y: 1 }} // Gradient end (bottom-right)
                    >
                    <Text style={{ color: '#fff', fontWeight: "bold"}}>{element.name}</Text>
                    <Text style={{ color: '#fff'}}>{element.colors[0]}  |  {element.colors[1]}  |  {element.colors[2]}</Text>
            
               
              </LinearGradient>

                  
            
                 <View style={[globalStyles.screenStyles.centerColumn, {marginTop: 25}]} >
                     <Text  style={[{ color: 'white', fontSize:  20, margin: 20,  }]}>Primary: {element.primary}</Text>
                        <View style={{width: 300, height: 30, backgroundColor: element.primary, borderColor: '#fff',  borderWidth: 1, borderRadius: 4,  }}></View>

                      <Text  style={[{ color: 'white', fontSize:  20, margin: 20,  }]}>Primary-Light: {element.primaryLight}</Text>
                        <View style={{width: 300, height: 30, backgroundColor: element.primaryLight, borderColor: '#fff',  borderWidth: 1, borderRadius: 4,  }}></View>

                      <Text  style={[{ color: 'white', fontSize:  20, margin: 20 , }]}>Primary-Dark: {element.primaryDark}</Text>
                        <View style={{width: 300, height: 30, backgroundColor: element.primaryDark, borderColor: '#fff',  borderWidth: 1, borderRadius: 4, }}></View>

                      <Text  style={[{ color: 'white', fontSize:  20, margin: 20,  }]}>Secondary: {element.secondary}</Text>
                        <View style={{width: 300, height: 30, backgroundColor: element.secondary, borderColor: '#fff',  borderWidth: 1, borderRadius: 4, }}></View>

                      <Text  style={[{ color: 'white', fontSize:  20, margin: 20,  }]}>Secondary-Light: {element.secondaryLight}</Text>
                        <View style={{width: 300, height: 30, backgroundColor: element.secondaryLight, borderColor: '#fff',  borderWidth: 1, borderRadius: 4,  }}></View>

                      <Text  style={[{ color: 'white', fontSize:  20, margin: 20,  }]}>Secondary-Dark: {element.secondaryDark}</Text>
                        <View style={{width: 300, height: 30, backgroundColor: element.secondaryDark, borderColor: '#fff',  borderWidth: 1, borderRadius: 4, }}></View>
                      
             </View>

          </ScrollView>


       
      )}
      
{type === "typography" && data?.length > 0 && data[0].styles && (
  <ScrollView
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}
  >
    <View style={{ alignItems: 'center' }}>
    <Text style={[globalStyles.screenStyles.textShadow, { color: 'white', fontSize: 40, marginTop: 20, fontStyle: 'italic' }]}>
          {data[0].name}
      </Text>
     
      <Text style={{ color: 'white', fontSize: 20, marginTop: 20 }}>Examples</Text>
     

    <Text
      style={{
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderRadius: 5,
        padding: 20,
      }}
    >
      Typography scales are essential in UI/UX design because they establish a clear visual hierarchy, ensuring that users can quickly distinguish between elements like headings, subheadings, and body text. This structured approach enhances readability and guides the user’s eye naturally through the interface.
    </Text>
    </View>

    {data?.[0]?.styles?.map((element, index) => (
  <View
    key={`${element.label}-${index}`}
    style={{
      marginTop: 50,
      backgroundColor: 'transparent',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'white',
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: element.size,
        textAlign: 'center',
      }}
    >
      {element.label}
    </Text>

    <Text
      style={{
        color: 'white',
        fontSize: element.size,
        textAlign: 'center',
      }}
    >
      {element.example}
    </Text>
  </View>
))}

  </ScrollView>
)}

      {/* Icon Type Renders
         - show like 5-10 different icons from the brand to show the user what they would be using 
         - use case examples ?
         - since these are all done separate you can write a different about description for each and provide links, designers, company
     */}
      
{iconType === "feather" && (
  <View style={{ alignItems: 'center' }}>

    <Icon type='feather' />
  </View>
)}

{iconType === "evil" && (
  <View style={{ alignItems: 'center' }}>
    <Icon type='evil' />
  </View>
)}

{iconType === "simple" && (
  <View style={{ alignItems: 'center' }}>
    <Icon type='simple' />
  </View>
)}

{iconType === "octicons" && (
  <View style={{ alignItems: 'center' }}>
 
    <Icon type='octicons' />
  </View>
)}

{iconType === "ionicons" && (
  <View style={{ alignItems: 'center' }}>
    <Icon type='ionicons' />
  </View>
)}

{iconType === "Fontawesome" && (
  <View style={{ alignItems: 'center' }}>
    <Icon type='Fontawesome' />
  </View>
)}

{iconType === "material" && (
  <View style={{ alignItems: 'center' }}>

    <Icon type='material' />
  </View>
)}

      {/* Component Renders 
         
         - show the component dimensions card and btn and the way it might look 
         - talk about why this would be good for the topic picked or just whats this component is good for in general
         - there will be no about/designer section since its just dimensions that can be automated
          maybe just explain the importance of having corro components that are pre-made and ready to inject 
          
          - you could also demonstrate which colors (as in primary, secondar ect.) goes where on the component (ex. border: primary-light)
      */}
      {(type === "component" || type === "styledComponents") && (

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[globalStyles.screenStyles.textShadow, { color: 'white', fontStyle: 'italic', fontSize: 40, marginBottom: 30, marginTop: 30}]}>{packageName}</Text>
      
          < View>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>cardBorder:</Text>
              <Text style={{ color: 'white' }}>{cardBorder}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>cardBorderRadius:</Text>
              <Text style={{ color: 'white' }}>{cardBorderRadius}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>cardBoxShadow:</Text>
              <Text style={{ color: 'white' }}>{cardBoxShadow}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>cardLayout:</Text>
              <Text style={{ color: 'white' }}>{cardLayout}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>cardDir:</Text>
              <Text style={{ color: 'white' }}>{cardDir}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>cardPadding:</Text>
              <Text style={{ color: 'white' }}>{cardPadding}</Text>
            </View>
          </View>
          <View style={{
  borderWidth: cardBorder && cardBorder.includes('-') ? parseInt(cardBorder.split('-')[1]) : 1,
  borderColor: cardBorder && cardBorder.includes(' ') ? cardBorder.split(' ')[1] : 'black',
  borderRadius: cardBorderRadius,
  shadowColor: cardBoxShadow && cardBoxShadow.split(' ').length > 3 ? cardBoxShadow.split(' ')[3] : 'black',
  shadowOffset: {
    width: cardBoxShadow && cardBoxShadow.split(' ').length > 0 ? parseInt(cardBoxShadow.split(' ')[0]) : 0,
    height: cardBoxShadow && cardBoxShadow.split(' ').length > 1 ? parseInt(cardBoxShadow.split(' ')[1]) : 0
  },
  shadowOpacity: 0.2,
  shadowRadius: cardBoxShadow && cardBoxShadow.split(' ').length > 2 ? parseInt(cardBoxShadow.split(' ')[2]) : 5,
  elevation: 15,
  flexDirection: cardDir,
  padding: cardPadding,
  backgroundColor: 'white',
  height: 150,
  width: 100,
  margin: 20
}}>
  <Text style={{ color: 'black' }}>Card</Text>
</View>

{/* Button Style */}
<Text style={[{ color: 'white', fontSize:  20, margin: 20, fontWeight: 'bold' }]}>
    Button Component
</Text>
<View>
 <View>
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>btnBorder:</Text>
    <Text style={{ color: 'white' }}>{btnBorder}</Text>
  </View>
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>btnBorderRadius:</Text>
    <Text style={{ color: 'white' }}>{btnBorderRadius}</Text>
  </View>
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>btnBoxShadow:</Text>
    <Text style={{ color: 'white' }}>{btnBoxShadow}</Text>
  </View>
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>btnMargin:</Text>
    <Text style={{ color: 'white' }}>{btnMargin}</Text>
  </View>
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>btnPadding:</Text>
    <Text style={{ color: 'white' }}>{btnPadding}</Text>
  </View>
</View>
</View>
<View style={{
  borderWidth: btnBorder && btnBorder.split(' ').length > 0 ? parseInt(btnBorder.split(' ')[0]) : 1,
  borderColor: btnBorder && btnBorder.split(' ').length > 1 ? btnBorder.split(' ')[1] : 'black',
  borderRadius: btnBorderRadius,
  shadowColor: btnBoxShadow && btnBoxShadow.split(' ').length > 3 ? btnBoxShadow.split(' ')[3] : 'black',
  shadowOffset: {
    width: btnBoxShadow && btnBoxShadow.split(' ').length > 0 ? parseInt(btnBoxShadow.split(' ')[0]) : 0,
    height: btnBoxShadow && btnBoxShadow.split(' ').length > 1 ? parseInt(btnBoxShadow.split(' ')[1]) : 0
  },
  shadowOpacity: 0.1,
  shadowRadius: btnBoxShadow && btnBoxShadow.split(' ').length > 2 ? parseInt(btnBoxShadow.split(' ')[2]) : 5,
  elevation: 6,
  margin: btnMargin,
  paddingVertical: btnPadding && btnPadding.split(' ').length > 0 ? parseInt(btnPadding.split(' ')[0]) : 5,
  paddingHorizontal: btnPadding && btnPadding.split(' ').length > 1 ? parseInt(btnPadding.split(' ')[1]) : 10,
  backgroundColor: 'white',
  height: 50,
  width: 150,
  margin: 20
}}>
  <Text style={[{color: 'black'}]}>
     Button
  </Text>
</View>

        </View>
      )}

      </ScrollView>
      </View>
    </View>
  );
};

export default ElementScreen;
