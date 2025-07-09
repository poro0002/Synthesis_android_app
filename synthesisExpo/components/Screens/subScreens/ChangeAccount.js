import React, { useEffect, useState } from 'react';
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
  Pressable, // Import Pressable for user interactions
  DevSettings 
} from 'react-native';

import { faExternalLinkSquare } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import { ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native';

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

// notes

// make sure the new password is different from the old one 
// error messages need to be displayed for the user
// make sure its changed properly on the backend and in the firestore DB
// 


const ChangeAccount = ({ route }) => {

  const {type} = route.params;
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading]= useState(false);
const headerHeight = useHeaderHeight();
const navigation = useNavigation();



// fetch the username from the storage after the initial render
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username1 = await AsyncStorage.getItem('username');
        if (username1) {
          setScreenData(prev => ({ ...prev, oldUsername: username1 }));
        }
      } catch (err) {
        console.error('Failed to get username from AsyncStorage:', err);
      }
    };
    fetchUsername();
    console.log(type)
  }, []);


  // Use this for debugging error messages 

  // useEffect(() => {
  //   console.log("Updated screenData:", screenData);
  // }, [screenData]);

  useEffect(() => {
    if (errorMessage) {
      console.log("Current error message:", errorMessage);
      
    }
  }, [errorMessage]);

  useEffect(() => {
    if(type === 'user'){
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem('username'); // gets the existing storage username
      if (savedUsername) {
        setScreenData(prev => ({ // when it finds it it will set the original storage saved one AS the old one 
          ...prev,
          oldUsername: savedUsername,
        }));
      }
    };
    loadUsername();
  }
  }, [type]);

 
    const [screenData, setScreenData] = useState({
        newUsername: "",
        oldUsername: "",
        pass: "",
        confirmPass: "",
    })




    const handleInputChange = (property, value) => {
      console.log("Updated screenData:", screenData);
        setScreenData(prev => ({ ...prev, [property]: value })); // matches the coro property and updates the value on change 
      };

    const registerRules = [
        {username: [
            { condition: value => value.length >= 8, message: `username needs to be at least 8 characters` },
            { condition: value => /[a-z]/.test(value), message: `username needs to have at least 1 lowercase letter` },
            { condition: value => /[A-Z]/.test(value), message: `username needs to have at least 1 uppercase letter` },
           ]
        },
     {password:[
             { condition: value => value.length >= 8, message: `password needs to be at least 8 characters` },
             { condition: value => /[a-z]/.test(value), message: `password needs to have at least 1 lowercase letter` },
             { condition: value => /[A-Z]/.test(value), message: `password needs to have at least 1 uppercase letter` },
             { condition: value => /[0-9]/.test(value), message: `password needs to have at least one number` },
             ]
         },
       {email:  [{ condition: value => /@(gmail\.com|outlook\.com|hotmail\.com)$/.test(value), message: `Please use a valid email.` }]
       }
   
    ];

    function testUsername(data){
      setErrorMessage("")
          const allPassed = registerRules[0].username.every(rule => {
            if (!rule.condition(data.newUsername)) {
  
              setErrorMessage(rule.message); // Log error message if a condition fails
              console.log(rule.message);
              return false; // Stop on the first failed condition
            }
            return true;
          });
      return allPassed;
      }


    function testPass(data){
      setErrorMessage("")
          const allPassed = registerRules[1].password.every(rule => {
            if (!rule.condition(data.confirmPass)) {
              console.log(rule.message);
              setErrorMessage(rule.message); // Log error message if a condition fails
              
              return false; // Stop on the first failed condition
            }
            return true;
          });
      return allPassed;
      }
    

      const changePassword = async () => {
         
          const fetchURL = `${apiUrl}/changePass`
          const fetchHeaders = new Headers({'Content-Type':'application/json'})

       
          const fetchOptions = {
            method: 'POST',
            mode: 'cors',
            headers: fetchHeaders,
            body: JSON.stringify(screenData),
          }

          console.log('change password btn pressed')
    

          if(!testPass(screenData)){
            setLoading(false);
            return;
          }

           setLoading(true)

          if(screenData.pass === screenData.confirmPass){

            try{
                const response = await fetch(fetchURL, fetchOptions);
          
                if(!response.ok){
                 throw new error('something went wrong with the fetch')
                }
          
                const data = await response.json();
          
                if(data.message === "password successfully changed"){
                   setErrorMessage("password successfully changed.........redirecting")
                  
                     navigation.navigate('Tabs', {
                       screen: 'Home',
                      });
                
                } else{
                  setErrorMessage("there was an issue trying to change your password")
                }
          
          
              }catch(err){
                console.error('Fetch error:', err);
                setErrorMessage('Something went wrong with the fetch');
              }finally{
                setLoading(false)
              }

          }else{
            setErrorMessage("passwords do not match")
            return;
          }
        
      }


  const changeUsername = async () => {
   
    const fetchURL = `${apiUrl}/changeUsername`
    const fetchHeaders = new Headers({'Content-Type':'application/json'})

    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      headers: fetchHeaders,
      body: JSON.stringify(screenData),
    }

    if(!testUsername(screenData)){
      setLoading(false);
      return;
    }

     setLoading(true)

    try{
    
        const response = await fetch(fetchURL, fetchOptions);
  
        // if(!response.ok){
        //  throw new Error('something went wrong with the fetch')
        // }
  
        const data = await response.json();
  
        if(data.message === 'username successfully changed'){
          setErrorMessage("username successfully changed.........redirecting");
            await AsyncStorage.setItem('username', screenData.newUsername);
            setScreenData(prev => ({
              ...prev,
              oldUsername: screenData.newUsername,
              newUsername: '',
              confirmPass: '',
              pass: '',
            }));
        
              navigation.navigate('Tabs', {
                screen: 'Home',
               });
        
           
        } else if(data.message === 'could not find a user with that username'){
            setErrorMessage("could not find a user with that username");
        } else if(data.message === 'That username is already taken'){
           setErrorMessage("That username is already taken")
         } else{
            setErrorMessage('something went wrong with trying to change your username');
        }
  
  
      }catch(err){
        console.error('Fetch error:', err);
        setErrorMessage('Something went wrong with the fetch');
      }
      finally{
        setLoading(false)
      }

  }

   return ( 
    loading ? (    
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 0, }}>
             <LottieView
                source={require('../../../assets/loading1.json')}
                autoPlay
                loop
                style={{ width: 100, height: 100, alignSelf: 'center'}}
              />
           <Text>Updating User Credentials....</Text>
         </View>):

    <View style={{flex: 1, position: 'relative', zIndex: 0,}}>
               
                  <ImageBackground
                         source={require('../../../assets/green-gradient.png')}
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
       
           <View style={{ flex: 1, zIndex: 1, }}>
       
              <View style={[{ alignItems:'center', paddingTop: headerHeight, paddingBottom: headerHeight, paddingHorizontal: 20}]}>
            {type === 'pass' && 
              <>
               <Text style={[globalStyles.screenStyles.h2, globalStyles.screenStyles.textShadow ]}>Change Password</Text>
                 <MaterialIcons name="lock" size={54} color="white" style={[globalStyles.screenStyles.iconShadow, { marginRight: 10 }]} />
                      <Text style={[globalStyles.screenStyles.textShadow, { color: 'orange', textAlign: 'center', marginVertical: 10 }]}>{errorMessage}</Text>

                      <Text style={globalStyles.screenStyles.h4}>
                       Password 
                      </Text>
                     
                      <TextInput
                        style={[
                          globalStyles.screenStyles.input,
                          { 
                            marginBottom: 10, 
                            textAlignVertical: 'top', 
                            padding: 10,
                            width: '85%', 
                            borderColor: 'white', 
                          }
                               ]}
                        placeholderTextColor="gray"
                        placeholder="new password"
                        value={screenData.pass}
                        secureTextEntry={true} 
                        onChangeText={(value) => handleInputChange('pass', value)}
                      />
                      <Text style={globalStyles.screenStyles.h4}>
                        Confirm Password 
                      </Text>

                       <TextInput
                        style={[
                          globalStyles.screenStyles.input,
                          { 
                            marginBottom: 10, 
                            textAlignVertical: 'top',
                            padding: 10,
                            width: '85%', 
                            borderColor: 'white', 
                          }
                               ]}
                        placeholderTextColor="gray"
                        placeholder="confirm new pass"
                        value={screenData.confirmPass}
                        secureTextEntry={true} 
                        onChangeText={(value) => handleInputChange('confirmPass', value)}
                      />
                       <Pressable onPress={changePassword} style={{ 
                            marginTop: 10,
                            backgroundColor: 'royalblue',
                            borderRadius: 5,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            alignItems: 'center',
                            width: '85%'
                         }} >
                         <Text style={{color: 'white'}}>
                            Submit
                         </Text>
                      </Pressable>
           </>           
       }
        {type === 'user' && 
        <>
              <Text style={[globalStyles.screenStyles.h2, globalStyles.screenStyles.textShadow ]}>Change Username</Text>
                 <MaterialIcons name="edit" size={54} color="white"  style={[globalStyles.screenStyles.iconShadow, { marginRight: 10 }]}/>
                      <Text style={[globalStyles.screenStyles.textShadow, { color: 'orange', textAlign: 'center', marginVertical: 10 }]}>{errorMessage}</Text>
                      <TextInput
                        style={[
                          globalStyles.screenStyles.input,
                          { 
                            marginBottom: 10, 
                            textAlignVertical: 'top',
                            padding: 10,
                            width: '85%', 
                            borderColor: 'white', 
                          }
                        ]}
                         placeholderTextColor="gray"
                        placeholder="New Username"
                        value={screenData.newUsername}
                        onChangeText={(value) => handleInputChange('newUsername', value)}
                      />
                      <Pressable onPress={changeUsername} style={{ 
                            marginTop: 10,
                            backgroundColor: 'royalblue',
                            borderRadius: 5,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            alignItems: 'center',
                            width: '85%'
                         }}>
                         <Text style={{color: 'white'}}>
                            Submit
                         </Text>
                      </Pressable>
              </>           
       }
        
         </View>
       </View>
     </View>
   )
}


export default ChangeAccount;