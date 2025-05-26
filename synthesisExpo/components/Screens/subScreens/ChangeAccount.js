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
            return;
          }

          if(screenData.pass === screenData.confirmPass){

            try{
                const response = await fetch(fetchURL, fetchOptions);
          
                if(!response.ok){
                 throw new error('something went wrong with the fetch')
                }
          
                const data = await response.json();
          
                if(data.message === "password successfully changed"){
                   setErrorMessage("password successfully changed.........redirecting")
                   setTimeout(() => {
                    DevSettings.reload();
                  }, 2000);
                } else{
                  setErrorMessage("there was an issue trying to change your password")
                }
          
          
              }catch(err){
                console.error('Fetch error:', err);
                setErrorMessage('Something went wrong with the fetch');
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
      return;
    }

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
          setTimeout(() => {
            DevSettings.reload();
          }, 2000);
           
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

  }

   return (
      <View style={globalStyles.screenStyles.centerContainer}>
       {type === 'pass' && 
        <>
              <Text style={globalStyles.screenStyles.h2}>Change Password</Text>
                      <Text style={globalStyles.screenStyles.text}>{errorMessage}</Text>

                      <Text style={globalStyles.screenStyles.h4}>
                       Password 
                      </Text>

                      <TextInput
                        style={globalStyles.screenStyles.input}
                        placeholder="new password"
                        value={screenData.pass}
                        onChangeText={(value) => handleInputChange('pass', value)}
                      />
                      <Text style={globalStyles.screenStyles.h4}>
                        Confirm Password 
                      </Text>

                       <TextInput
                        style={globalStyles.screenStyles.input}
                        placeholder="confirm new pass"
                        value={screenData.confirmPass}
                        onChangeText={(value) => handleInputChange('confirmPass', value)}
                      />
                       <Pressable onPress={changePassword} style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'orange'}]}>
                         <Text>
                            Submit
                         </Text>
                      </Pressable>
           </>           
       }
        {type === 'user' && 
        <>
              <Text style={globalStyles.screenStyles.h2}>Change Username</Text>
                      <Text style={globalStyles.screenStyles.text}>{errorMessage}</Text>
                      <TextInput
                        style={globalStyles.screenStyles.input}
                        placeholder="New Username"
                        value={screenData.newUsername}
                        onChangeText={(value) => handleInputChange('newUsername', value)}
                      />
                      <Pressable onPress={changeUsername} style={[globalStyles.screenStyles.viewBtn, { backgroundColor: 'orange'}]}>
                         <Text>
                            Submit
                         </Text>
                      </Pressable>
           </>           
       }
        
     </View>
   )
}


export default ChangeAccount;