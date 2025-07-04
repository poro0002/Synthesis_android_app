
import globalStyles from '../../styles';
import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Battery from 'expo-battery';


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
  SafeAreaView
} from 'react-native';

import { useAuth } from '../../LogContext'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo vector icons
import VideoBackground from './Bkgd/VideoBackground'; 
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 


const HomeScreen = () => {

  const renderCount = useRef(0);
  console.log(`🔁 HomeScreen rendered ${renderCount.current++} times`);

     const [topic, setTopic] = useState("home");
     const [currentTime, setCurrentTime] = useState('');
     const [batteryLevel, setBatteryLevel] = useState(null);
     const [tipsData, setTipsData] = useState();

     const { setSelectedElements, username } = useAuth();
     const navigation = useNavigation();
     const headerHeight = useHeaderHeight();

   const todayString = `Today \u2022 ${new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;


    const photoArr = [
      { 
        image: require('../../assets/portfolio-projects/batman_mockup.png'),
        title: 'The Batman Netflix Mockup',
        WS: ['Adobe XD'],
        description: '',
        artist: 'Kieran Poropat',
      },
      { 
        image: require('../../assets/portfolio-projects/black-myth-mockups/Black Wukong Mockup.png'),
        title: 'Black Myth: Wukong Pre Release Main Screen Concept',
        WS: ['Adobe XD', 'Gimp'],
        description: '',
        artist: 'Kieran Poropat',
      },
      { 
        image: require('../../assets/portfolio-projects/dune/dune-screen-4.png'),
        title: 'Dune Movie Website Promotion Concept',
        WS: ['Adobe XD', 'Gimp'],
        description: '',
        artist: 'Kieran Poropat',
      },
      { 
        image: require('../../assets/portfolio-projects/nike-offwhite-mockups/Nike x Off White ipad mockup.png'),
        title: 'Nike Off White Mobile App Store Mockup',
        WS: ['Adobe XD', 'Gimp'],
        description: '',
        artist: 'Kieran Poropat',
      },
      { 
        image: require('../../assets/portfolio-projects/Smarthome Prototype/smartHUD mockup white.png'),
        title: 'SmartHome App Mockup Idea',
        WS: ['Adobe XD', 'Gimp'],
        description: '',
        artist: 'Kieran Poropat',
      },
    ];

    let randomPhotoIndex = Math.floor(Math.random() * photoArr.length);




    useEffect(() => {
        const getBatteryLevel = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel(Math.round(level * 100)); // convert to %
        };
      
        getBatteryLevel();
      
        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(Math.round(batteryLevel * 100));
        });
      
        return () => subscription.remove();
    }, []);


    useEffect(() => {
      const timer = setInterval(() => {
          const now = new Date();
          const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
          setCurrentTime(formattedTime);
      }, 1000);
    
      return () => clearInterval(timer); // cleanup on unmount
    }, []);



     // selected elements state var is used on multiple screens so if canceled(returns to home) they need to be cleared so it doesn't interfere

     // In React, every call to setState  triggers a re-render, even if you’re “re-setting” the same data. 
     // so this code below basically compares the previous data to the current state
     // and if its runs true it returns the prev state, and if false it updates
    
     useFocusEffect(
          useCallback(() => {
            setSelectedElements(prev => {
              const isAlreadyCleared = Object.values(prev).every(arr => Array.isArray(arr) && arr.length === 0); // compares
              return isAlreadyCleared ? prev : {
                fonts: [],
                gradients: [],
                typography: [],
                icons: [],
                comp: [],
                name: [],
                about: [],
              };
            });
          }, [setSelectedElements])
        );


 
     const handleTopic = async (selectedTopic) => {
         setTopic(selectedTopic);
     //     console.log(selectedTopic)
        
         navigation.navigate('Topic', { topic: selectedTopic, username: username });
     }

  // this code makes it so when the navigation stack says that you are currently on this screen it rerenders the getUsername function 
  
const handleCustomDesign = () => {
     console.log('handleCustomDesign clicked !')
     navigation.navigate('CustomDesignScreen');
}

useLayoutEffect(() => {
     navigation.setOptions({
       headerRight: () => (
         <Pressable onPress={handleCustomDesign} style={{ marginRight: 16}}>
         
           <MaterialIcons style={globalStyles.screenStyles.iconShadow} name="add" size={35} color="blue" />
          
         </Pressable>
       ),
     });
   }, [navigation]);


   const fetchUXTips = async () =>{

    let fetchURL = `${apiUrl}/pickElement?category=tips`


    const fetchHeaders = new Headers({'Content-Type': 'application/json'});

    const fetchOptions = {
        method: "GET",
        headers: fetchHeaders,
        mode: 'cors',
    }


    try{

      let response = await fetch(fetchURL, fetchOptions);

      if (!response.ok) {
        throw new Error('There was an issue with the fetch');
      }

      let data = await response.json();
      
      let randomIndex = Math.floor(Math.random() * 20); // or make this data.length
      let randomTip = data[randomIndex];
      setTipsData(randomTip);

  

    }catch(err){
       console.log('there was a problem fetching data from the UX API:', err)
    }
   }

   useEffect(() =>{
   
    fetchUXTips();
   }, []);

      
   

  return (
   
  <SafeAreaView style={{ flex: 1, backgroundColor: 'black',}}>
     <View style={{flex: 1, position: 'relative', alignItems: 'center', zIndex: 0}}>
           <ImageBackground
               source={require('../../assets/purple-gradient.jpg')}
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
                 contentContainerStyle={{  flexDirection: 'column', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20,}}
                 keyboardShouldPersistTaps="handled"
                 >
        
               <Text style={[globalStyles.screenStyles.h1, globalStyles.screenStyles.textShadow, {textAlign: 'center', }]}>Welcome, {username}</Text>
               <LottieView
                  source={require('../../assets/animation1.json')}
                  autoPlay
                  loop
                  style={{ width: 80, height: 80, alignSelf: 'center'}}
                />

                
                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
                    ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
                </Text>
               <Text style={globalStyles.screenStyles.text}>
                    Today &#8226;{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {new Date().toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </Text>
               
           
                 
              
                  <Text style={{color: 'white', textAlign: 'center'}}>
                   Battery: {batteryLevel !== null ? `${batteryLevel}%` : 'Loading...'}
                  </Text>

                  <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 10,}}>
                      {currentTime || 'Loading...'}
                   </Text>
          

                  <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
                ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
                </Text>


        <Text style={globalStyles.screenStyles.text}>What are you Looking For ?</Text>

      <View style={globalStyles.screenStyles.row}>
              
            <Pressable onPress={() => handleTopic('entertainment')} style={globalStyles.screenStyles.topicComp}>
              <MaterialIcons name="movie" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
              <Text style={globalStyles.screenStyles.topicText}>Entertainment</Text>
            </Pressable>

            <Pressable onPress={() => handleTopic('tech')} style={globalStyles.screenStyles.topicComp}>
              <MaterialIcons name="memory" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
              <Text style={globalStyles.screenStyles.topicText}>Tech</Text>
            </Pressable>

            <Pressable onPress={() => handleTopic('health')} style={globalStyles.screenStyles.topicComp}>
              <MaterialIcons name="favorite" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
              <Text style={globalStyles.screenStyles.topicText}>Health</Text>
            </Pressable>

        </View>

          <View style={globalStyles.screenStyles.row}>

              <Pressable onPress={() => handleTopic('food')} style={globalStyles.screenStyles.topicComp}>
                <MaterialIcons name="restaurant" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
                <Text style={globalStyles.screenStyles.topicText}>Food</Text>
              </Pressable>

              <Pressable onPress={() => handleTopic('finance')} style={globalStyles.screenStyles.topicComp}>
                <MaterialIcons name="attach-money" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
                <Text style={globalStyles.screenStyles.topicText}>Finance</Text>
              </Pressable>

              <Pressable onPress={() => handleTopic('sport')} style={globalStyles.screenStyles.topicComp}>
                <MaterialIcons name="sports-soccer" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
                <Text style={globalStyles.screenStyles.topicText}>Sport</Text>
              </Pressable>

          </View>

          <View style={globalStyles.screenStyles.row}>

              <Pressable onPress={() => handleTopic('travel')} style={globalStyles.screenStyles.topicComp}>
                <MaterialIcons name="flight" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
                <Text style={globalStyles.screenStyles.topicText}>Travel</Text>
              </Pressable>

              <Pressable onPress={() => handleTopic('music')} style={globalStyles.screenStyles.topicComp}>
                <MaterialIcons name="music-note" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
                <Text style={globalStyles.screenStyles.topicText}>Music</Text>
              </Pressable>

              <Pressable onPress={() => handleTopic('education')} style={globalStyles.screenStyles.topicComp}>
                <MaterialIcons name="school" size={24} color="white" style={globalStyles.screenStyles.iconShadow} />
                <Text style={globalStyles.screenStyles.topicText}>Education</Text>
              </Pressable>

          </View>

        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
                    ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
                </Text>

         <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, {marginTop: 20}]}>Tip Of The Day</Text>

    {tipsData ? ( 
     
     <View style={{marginBottom: 20}}>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                  <MaterialIcons name={tipsData.icon} size={24} color="white" style={[globalStyles.screenStyles.iconShadow, {marginRight: 15}]} />
    
                    <Text style={{ color: 'white', fontWeight: 'bold'}}>
                        {tipsData.title}
                    </Text>
                </View>

                  <Text style={{ color: 'white', fontStyle: 'italic'}}>
                      {tipsData.tip}
                  </Text>
            </View> 
            ) : (
              <Text style={{color: 'white'}} >
                loading Tips of the day data
              </Text>
      )}


        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
                    ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
                </Text>

           <Text style={[globalStyles.screenStyles.h4, globalStyles.screenStyles.textShadow, {marginTop: 20, marginBottom: 20}]}>Inspiration Board</Text>

      <View style={globalStyles.screenStyles.row}>

        <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
            {photoArr[randomPhotoIndex].title}
        </Text>

        <Text style={{color: 'white', fontSize: 11, fontStyle: 'italic'}}>
              {photoArr[randomPhotoIndex].WS[0]}  {photoArr[randomPhotoIndex].WS[1]}
          </Text>
    
            <View style={{
              width: 350,
              height: 200,
              borderRadius: 10,
              overflow: 'hidden',
              alignSelf: 'center', 
              shadowColor: 'rgba(0, 0, 0, 0.8)',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
              elevation: 5, 
              borderWidth: 1,
              borderColor: 'white',
              marginTop: 30,

            
          }}>
              <Image
                  source={photoArr[randomPhotoIndex].image}
                  style={[globalStyles.screenStyles.iconShadow, {
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover', 
                  }]}
              />
          </View>
          <Text style={{color: 'white', fontSize: 11, fontStyle: 'italic' }}>
           {photoArr[randomPhotoIndex].artist}
        </Text>
       </View>

        </ScrollView>

      </View>
      </View>
 </SafeAreaView>    

  );
};

export default React.memo(HomeScreen);
