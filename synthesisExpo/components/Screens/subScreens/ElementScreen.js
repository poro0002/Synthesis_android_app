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

  if (iconType === "component") {
    // btn
    btnBorder = data.styledComponents.components.button.styles.borderWidth + ' ' + data.styledComponents.components.button.styles.borderColor;
    btnBorderRadius = data.styledComponents.components.button.styles.borderRadius;
    btnBoxShadow = `${data.styledComponents.components.button.styles.shadowOffset.width} ${data.styledComponents.components.button.styles.shadowOffset.height} ${data.styledComponents.components.button.styles.shadowRadius} ${data.styledComponents.components.button.styles.shadowColor}`;
    btnMargin = data.styledComponents.components.button.styles.margin;
    btnPadding = `${data.styledComponents.components.button.styles.paddingVertical} ${data.styledComponents.components.button.styles.paddingHorizontal}`;

    // card
    cardBorder = data.styledComponents.components.card.styles.borderWidth + ' ' + data.styledComponents.components.card.styles.borderColor;
    cardBorderRadius = data.styledComponents.components.card.styles.borderRadius;
    cardBoxShadow = `${data.styledComponents.components.card.styles.shadowOffset.width} ${data.styledComponents.components.card.styles.shadowOffset.height} ${data.styledComponents.components.card.styles.shadowRadius} ${data.styledComponents.components.card.styles.shadowColor}`;
    cardLayout = 'flex';
    cardDir = data.styledComponents.components.card.styles.flexDirection;
    cardPadding = data.styledComponents.components.card.styles.padding;
  }

  return (
    <View style={globalStyles.screenStyles.centerContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>   
        <Pressable>
          <MaterialIcons name='favorite' size={50} color='orange'/>
        </Pressable>
      </View>
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

      {type === "typography" && (
        // first section show the hierarchy using the example of each scale to show how it will look stacked together
        // have an about section for what this would be best for ?

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{  flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                
                
                 <View style={{alignItems: 'center'}}>
                    <Text style={[{ color: 'white', fontSize: 35 }]}>Typography Scale</Text>
                   
                 
                    <Text  style={[{ color: 'white', fontSize:  20, marginTop: 20  }]}>Examples</Text>
                </View>
           {data.typography.map((element) => {
                    return(
                     
                     <View key={element.label} style={[globalStyles.screenStyles.centerColumn, {marginTop: 50,backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20, }]} >
                        <Text style={[{ color: 'black', fontSize: element.size, fontWeight: 'bold',  }]} >
                           {element.label}
                        </Text>
                    
                     <Text style={[{ color: 'black', fontSize: element.size, textAlign: 'center' }]} >
                       {element.example}
                     </Text>
                    
                  </View>
               )
           })}
              <Text style={[{ color: 'black', fontSize:  13, textAlign: 'center', marginTop: 30, backgroundColor: '#f8f8f8', borderRadius: 5, padding: 20 }]}>
                        Typography hierarchy is crucial in design systems because it helps organize content in a way that is visually clear and easy to read. By defining distinct typographic levels—such as headings, subheadings, and body text—it guides the reader’s eye, making the content more digestible and accessible. Proper hierarchy ensures that important information stands out, while less critical details are presented in a way that doesn’t overwhelm the viewer. Effective use of typography creates visual flow and structure, allowing for consistent and scalable designs across different platforms. This enhances user experience by improving navigation and ensuring that content is both aesthetically pleasing and easy to interact with
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
          <Text style={[{ color: 'white', fontSize: 25}]}>
             {data.styledComponents.package}
          </Text>
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
          <View  style={{
            borderWidth: parseInt(cardBorder.split(' ')[0]),
            borderColor: cardBorder.split(' ')[1],
            borderRadius: cardBorderRadius,
            shadowColor: cardBoxShadow.split(' ')[3],
            shadowOffset: {
              width: parseInt(cardBoxShadow.split(' ')[0]),
              height: parseInt(cardBoxShadow.split(' ')[1])
            },
            shadowOpacity: 0.2, // Using the value from JSON
            shadowRadius: parseInt(cardBoxShadow.split(' ')[2]),
            elevation: 15, // Using the value from JSON
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
          <Text style={[{ color: 'white', fontSize:  20, margin: 20, fontWeight: 'bold'   }]}>
               Button Component
          </Text>
          <View >
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
          <View style={{
            borderWidth: parseInt(btnBorder.split(' ')[0]),
            borderColor: btnBorder.split(' ')[1],
            borderRadius: btnBorderRadius,
            shadowColor: btnBoxShadow.split(' ')[3],
            shadowOffset: {
              width: parseInt(btnBoxShadow.split(' ')[0]),
              height: parseInt(btnBoxShadow.split(' ')[1])
            },
            shadowOpacity: 0.1, // Using the value from JSON
            shadowRadius: parseInt(btnBoxShadow.split(' ')[2]),
            elevation: 6, // Using the value from JSON
            margin: btnMargin,
            paddingVertical: parseInt(btnPadding.split(' ')[0]),
            paddingHorizontal: parseInt(btnPadding.split(' ')[1]),
            backgroundColor: 'white',
            height: 50,
            width: 150,
              margin: 20
          }}>
            <Text style={{ color: 'black' }}>Button</Text>
        </View>

        </View>
      )}
    </View>
  );
};

export default ElementScreen;
