import React from 'react';
import globalStyles from '../../../styles';


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

import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { MaterialIcons } from '@expo/vector-icons';

import Icon from './Icon'

const ElementScreen = ({ route }) => {
  const { element, type, iconType, data } = route.params;

  // console.log("ElementScreen received data:", data);



  // const [selectedFavBtn, setSelectedFavBtn] = useState(false);

  // const saveFavorite =  async (element) =>{
  //     const fetchURL = `http://192.168.1.83:4500/save?type=${type}`
  //     const fetchHeaders = new Headers({'Content-Type':'application/json'})

  //     const fetchOptions = {
  //       method: 'POST',
  //       mode: cors,
  //       headers: fetchHeaders,
  //       body: element,
  //     }

  //     try{
  //       const response = await fetch(fetchURL, fetchOptions);

  //       if(!response.ok){
  //         throw new error('there was a problem with the response')
  //       }

  //       let data = await response.json();

  //       if(data.message === 'successfully saved element to your favorites'){
  //         // show the user that their favorite was stored on the DB correctly
  //         console.log(data.message)
  //       }  else{
  //         console.log('the favorite could not be saved')
  //       }

  //     }catch(err){
  //        console.log('there was an error with the fetch', err)
  //     }

  // }

  let alpha = "Aa | Bb | Cc | Dd | Ee | Ff | Gg |  Hh | Ii | Jj | Kk | Ll | Mm | Nn | Oo | Pp | Qq | Rr | Ss | Tt | Uu | Vv | Ww | Xx | Yy | Zz" 

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

  const packageName = data?.comp?.[0]?.package ?? 'Unknown Package';

  if (iconType === "component" && data.styledComponents?.components) {
    try {
      btnBorder = data.styledComponents.components.button.styles.borderWidth + ' ' + data.styledComponents.components.button.styles.borderColor;
      btnBorderRadius = data.styledComponents.components.button.styles.borderRadius;
      btnBoxShadow = `${data.styledComponents.components.button.styles.shadowOffset.width} ${data.styledComponents.components.button.styles.shadowOffset.height} ${data.styledComponents.components.button.styles.shadowRadius} ${data.styledComponents.components.button.styles.shadowColor}`;
      btnMargin = data.styledComponents.components.button.styles.margin;
      btnPadding = `${data.styledComponents.components.button.styles.paddingVertical} ${data.styledComponents.components.button.styles.paddingHorizontal}`;

      cardBorder = data.styledComponents.components.card.styles.borderWidth + ' ' + data.styledComponents.components.card.styles.borderColor;
      cardBorderRadius = data.styledComponents.components.card.styles.borderRadius;
      cardBoxShadow = `${data.styledComponents.components.card.styles.shadowOffset.width} ${data.styledComponents.components.card.styles.shadowOffset.height} ${data.styledComponents.components.card.styles.shadowRadius} ${data.styledComponents.components.card.styles.shadowColor}`;
      cardLayout = 'flex';
      cardDir = data.styledComponents.components.card.styles.flexDirection;
      cardPadding = data.styledComponents.components.card.styles.padding;
    } catch (error) {
      console.log("Error accessing styled components:", error);
      return <Text style={{ color: 'red' }}>Error accessing styled components data.</Text>;
    }
  }

  return (
    <View style={globalStyles.screenStyles.centerContainer}>
        <ScrollView   
                  contentContainerStyle={{  flexDirection: 'column'}}
                  keyboardShouldPersistTaps="handled"
                  >
      {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>   
      <Pressable onPress={() => { 
            saveFavorite(element); 
            setSelectedFavBtn(true); 
           }}>
            {selectedFavBtn ? (
               <MaterialIcons name='favorite-filled' size={50} color='orange'></MaterialIcons>
            ):
            (
              <MaterialIcons name='favorite-outlined' size={50} color='orange'></MaterialIcons>
            )
          }
            
        </Pressable>
      </View> */}
      {type === "font" && (
         <View style={globalStyles.screenStyles.centerColumn}>
          <View>
             <Text style={[{ color: 'white', fontSize:  30, fontFamily: element.name }]}>{element.name}</Text>
             <Text style={[{ color: 'white', fontSize:  20 }]}>Example</Text>
             

          </View>

          <View style={[{backgroundColor: '#f8f8f8', borderRadius: 5, padding:  20, margin: 5 }]}>
          <Text style={{fontSize:  18, fontWeight: 'bold'}}>All Characters: </Text>
                <Text style={[{ color: 'black', fontSize:  20, fontFamily: element.name }]}> {alpha}</Text>
             </View>

             <View style={[{backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20, margin: 5 }]}>
                <Text style={[{ color: 'black', fontSize:  15, fontFamily: element.name }]}><Text style={{fontSize:  18, fontWeight: 'bold'}}>Example Text: </Text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
             </View>


             <View style={[{backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20, margin: 5 }]}>
                <Text style={[{ color: 'black', marginBottom: 10, fontSize:  15  }]}><Text style={{fontSize:  18, fontWeight: 'bold'}}>Designer: </Text> {element.designer}</Text>
                <Text style={[{ color: 'black', fontSize:  15, marginBottom: 10  }]}> <Text style={{fontSize:  18, fontWeight: 'bold'}}>Info: </Text>  {element.description}</Text>
                <Text style={[{ color: 'black', fontSize:  15, marginBottom: 10 }]}><Text style={[{fontWeight: 'bold'}]}>CSS URI:</Text> {element.uri}</Text>
               
               
             </View>
           
          </View>
        
      )}

      {type === "color" && (
        // make the a view div that has the whole gradient color in it 
        // also show smaller examples of each of the primary and secondaries/ect. 
        // then do an about section for the gradient 

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{  flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
             <View>
                <Text style={[{ color: 'white' }]}>{element.name}</Text>
                <Text  style={[{ color: 'white', fontSize:  20 }]}>Example</Text>
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

             <Text style={{backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20, marginTop: 50,  }}>{element.description}</Text>
           

          </ScrollView>


       
      )}
{type === "typography" && data.typography && (
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <View style={{ alignItems: 'center' }}>
      <Text style={[{ color: 'white', fontSize: 35 }]}>Typography Scale</Text>
      <Text style={[{ color: 'white', fontSize: 20, marginTop: 20 }]}>Examples</Text>
    </View>

    {data.typography.map((element, index) => (
      <View key={`${element.label}-${index}`} style={[globalStyles.screenStyles.centerColumn, { marginTop: 50, backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20 }]}>
        <Text style={{
          color: 'black',
          fontSize: element.size,
          fontFamily: data.fontFamily,
          fontWeight: data.fontWeight?.match(/\d{3}/)?.[0] || '400',
          lineHeight: data.lineHeight,
          textAlign: 'center',
        }}>
          {element.label}
        </Text>

        <Text style={{
          color: 'black',
          fontSize: element.size,
          fontFamily: data.fontFamily,
          fontWeight: data.fontWeight?.match(/\d{3}/)?.[0] || '400',
          lineHeight: data.lineHeight,
          textAlign: 'center',
        }}>
          {element.example}
        </Text>
      </View>
    ))}

    <Text style={[{ color: 'black', fontSize: 13, textAlign: 'center', marginTop: 30, backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20 }]}>
      Typography hierarchy is crucial in design systems because it helps organize content...
    </Text>
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
      {iconType === "component" && (

        <View >
          <Text style={{ color: 'white' }}>Package: {packageName}</Text>
          {/* Card Style */}
          <Text style={[{ color: 'white', fontSize:  20, margin: 20, fontWeight: 'bold' }]}>
               Card Component
          </Text>
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
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 15 }}>btnBorder:</Text>
    <Text style={{ color: 'white' }}>{btnBorder}</Text>
  </View>
  {/* ... other info lines ... */}
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
  );
};

export default ElementScreen;
