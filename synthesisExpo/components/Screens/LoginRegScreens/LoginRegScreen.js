import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,  KeyboardAvoidingView, Platform,} from 'react-native';

import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity, // A button that responds to user touch with visual feedback
  TextInput, // For user input text fields
  ScrollView, // Enables scrolling for content that may exceed the screen height
  SectionList,
  Pressable,
  DevSettings, // For rendering a list with grouped data, like a <ul> with <li> 's'
  Image, // For displaying images from local or remote sources
  Modal, // For presenting content over the current view (like alerts or dialogs)
  Picker, // A dropdown component for selecting options <select> <option>
  ActivityIndicator, // For showing loading indicators during asynchronous tasks
  Switch, // A toggle component for binary options (on/off)
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import StackNavigator from '../../Routes/TabNavigator';
import { useAuth } from '../../../LogContext';
import VideoBackground from '../Bkgd/VideoBackground'; 

import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';
enableScreens(); // <---- It improves performance by reducing memory usage and optimizing the screen management lifecycle, especially when dealing with multiple screens.




const LoginRegScreen = () =>  {
  // States to manage whether login or register is clicked
  const [logClicked, setLogClicked] = useState(false);
  const [regClicked, setRegClicked] = useState(false);
  const { 
    isLoggedIn, 
    setIsLoggedIn, 
    username, 
    setUsername, 
    errorMessage, 
    setErrorMessage
   } = useAuth();

   

  // Separate state objects for login and register form data
  const [logData, setLogData] = useState(null);
  const [regData, setRegData] = useState(null);

  useEffect(() =>{
     setRegData({ username: '', pass: '', email: '' })
     setLogData({ username: '', pass: '' })
  }, [isLoggedIn])

  useEffect(() =>{
    setErrorMessage("");
  }, [regClicked, logClicked])

  // ----------------------------------------------------< Handle Input Changes >--------------------------------------------------------


  // Handle input change directly for login or register forms
  const handleLogInputChange = (name, value) => {
    setLogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegInputChange = (name, value) => {
    setRegData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleLog() {
    setLogClicked(true);
    setRegClicked(false);
  }

  function handleReg() {
    setRegClicked(true);
    setLogClicked(false);
  }


// ----------------------------------------------------< Store Login Status >--------------------------------------------------------


  useEffect(() => {
    // Save login status to AsyncStorage whenever isLoggedIn state changes
    const storeLoginStatus = async () => {
      await AsyncStorage.setItem('isLoggedIn', isLoggedIn.toString());
      if (isLoggedIn)  {
            await AsyncStorage.setItem('username', username);

          }
    };
    storeLoginStatus();
  }, [isLoggedIn, username]);


// ----------------------------------------------------< Use Effect Logs >--------------------------------------------------------


     useEffect(() => {
          console.log('Login data:', logData);
      }, [logData]);

      useEffect(() => {
          console.log('Register data:', regData);
      }, [regData]);

     useEffect(() => {
            console.log('error changed', errorMessage);
        }, [errorMessage]);


  // ----------------------------------------------------< Register Rules >--------------------------------------------------------

  // register rules conditions
  // username needs to be at least 8 char
  // password needs to have uppercase, lowercase, number & symbol, at least 8 char long
  // email must finish with gmail.com, outlook.com, hotmail.com, algonquinlive.com

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

// ----------------------------------------------------< Test Rules>------------------------------------------------------------------


function testUsername(data){

    setErrorMessage("")

        const allPassed = registerRules[0].username.every(rule => {
          if (!rule.condition(data.username)) {

            setErrorMessage(rule.message); // Log error message if a condition fails
            console.log(rule.message);
            return false; // Stop on the first failed condition
          }
          return true;
        });
    return allPassed;
    }


function testPassword(data){
    setErrorMessage("")
        const allPassed = registerRules[1].password.every(rule => {
          if (!rule.condition(data.pass)) {

            setErrorMessage(rule.message); // Log error message if a condition fails
            console.log(rule.message);
            return false; // Stop on the first failed condition
          }
          return true;
        });
    return allPassed;
    }


function testEmail(data) {
    setErrorMessage("");
    const emailRule = registerRules[2].email[0];

    // Check the email condition
    if (!emailRule.condition(data.email)) {
        setErrorMessage(emailRule.message);
        console.log(emailRule.message);
        return false;
    } else {
        return true;
    }
}


// ----------------------------------------------------< Handle Register >------------------------------------------------------------------


 const regSubmit = async () => {

    console.log('regSubmit fired', regData)
// the regData data needs to checkout against the rules before the api fetch is made


  if(testUsername(regData) && testPassword(regData) && testEmail(regData)){

      const registerURL = `${apiUrl}/register`; 
      const regHeaders = new Headers({'Content-Type': 'application/json'});

      const regOptions = {
           method: 'POST',
           headers: regHeaders,
           mode: 'cors',
           body: JSON.stringify(regData)
         }

        try {
            const response = await fetch(registerURL, regOptions);

             // Check if the response was successful
             //  if (!response.ok) {
             //  throw new Error('There was a problem with the register fetch');
             //   }

          // Parse the response body
            const data = await response.json();

          // Handle the data returned from the server
            if(data.message === 'Account successfully created'){
                  setLogClicked(true)
                  setRegClicked(false)
                  setErrorMessage(data.message)
                  console.log(data.message)
                } else if(data.message === 'there is another user with that username or email'){
                       setErrorMessage(data.message)
                       console.log(data.message)
                    }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    } else {
        console.log('Validation failed');
    }



// the fetch to the api to create the user in the mongo database needs to be done here
// error handling from the front end and displaying any errors from the response object

}

// ----------------------------------------------------< Handle Login >------------------------------------------------------------------


const logSubmit = async () => {


    console.log('logSubmit fired', logData)

 // do a fetch to the server side log route that includes a body with the log input values

      const logURL = `${apiUrl}/login`
      const logHeaders = new Headers({'Content-Type': 'application/json'});

      const logOptions = {
            method: 'POST',
            headers: logHeaders,
            mode: 'cors',
            body: JSON.stringify(logData)
          }

      try{
          const response = await fetch(logURL, logOptions)


          const data = await response.json();

         if(data.message === 'User successfully logged in'){
              setErrorMessage(data.message);
              setIsLoggedIn(true);
              setLogClicked(false)
             // store req.body.username <------
              setUsername(data.username)
              AsyncStorage.setItem('email', data.email)
              // save the received data from the database or body to a storage so it can be used on the client side
              // load the user profile component ? redirect ?
             }
          else if(data.message === 'Invalid username'){
                setErrorMessage(data.message)

              }else if(data.message === 'Invalid password'){
                  setErrorMessage(data.message)
                  } else{
                      setErrorMessage('Error logging in user')
                      }

          }
      catch(error){
        console.error('Error during login:', error);
         }

    }

return(
  isLoggedIn ? (
    <StackNavigator />
  ) : (
    // login/register form JSX here
 
   <View style={{flex: 1, position: 'relative', alignItems: 'center', zIndex: 0}}>
          <VideoBackground source={require('../../../assets/fluid1.mp4')} />
         <View style={{ flex: 1, zIndex: 1 }}>

  {!logClicked && !regClicked ? (
    <View style={styles.container}>
      <Pressable onPress={handleLog} style={({ pressed }) => [styles.logBtn, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable onPress={handleReg} style={({ pressed }) => [styles.regBtn, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  ) : null}

  {logClicked && (
   <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <Text style={styles.inputTag}>{errorMessage}</Text>
      <Text style={styles.inputTag}>Username</Text>
     
      <KeyboardAvoidingView
         behavior="height"
      >
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={logData.username}
        onChangeText={(value) => handleLogInputChange('username', value)}
        placeholderTextColor={'grey'}
      />
      <Text style={styles.inputTag}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={logData.pass}
        onChangeText={(value) => handleLogInputChange('pass', value)}
        placeholderTextColor={'grey'}
      />
      </KeyboardAvoidingView>
     
      <Pressable onPress={logSubmit} style={styles.submitBtn}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable onPress={handleReg} style={styles.buttonText}>
        <Text style={[styles.buttonText, {marginTop: 50, textDecorationLine: 'underline'}]}>Don't have an Account?  Register Here</Text>
      </Pressable>
    </View>
  )}

  {regClicked && (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      <Text style={styles.inputTag}>{errorMessage}</Text>
      <Text style={styles.inputTag}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={regData.username}
        onChangeText={(value) => handleRegInputChange('username', value)}
        placeholderTextColor={'grey'}
      />
      <Text style={styles.inputTag}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={regData.pass}
        onChangeText={(value) => handleRegInputChange('pass', value)} 
        placeholderTextColor={'grey'}
      />
    <Text style={styles.inputTag}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={regData.email}
        onChangeText={(value) => handleRegInputChange('email', value)}
        placeholderTextColor={'grey'}
      />
      <Pressable onPress={regSubmit} style={styles.submitBtn}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <Pressable onPress={handleLog} style={styles.buttonText}>
        <Text style={[styles.buttonText, {marginTop: 50, textDecorationLine: 'underline'}]}>Already have an Account? Login</Text>
      </Pressable>
    </View>
  )}
</View>
</View>
 )
)


}


export default LoginRegScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
 
  },
  logBtn: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: 'royalblue',
    borderRadius: 7,
    shadowColor: '#000',
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,

          // Android Shadow
          elevation: 6,
  },
  regBtn: {
     paddingTop: 20,
     paddingBottom: 20,
     paddingLeft: 40,
     paddingRight: 40,
    borderWidth: 3,
    backgroundColor: 'transparent',
    borderColor: 'white',
    marginTop: 30,
    color: 'white',
    borderRadius: 7,
    shadowColor: '#000',
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,

          // Android Shadow
          elevation: 6,
  },
  submitBtn: {
    justifyContent: 'center',
    marginTop: 50,
    width: '85%',
    height: '8%',
    backgroundColor: 'transparent',
    borderColor: 'royalblue',
    borderWidth: 3,
    padding: 10,
    borderRadius: 7,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  header: {
    marginTop: 20,
    color: 'white',
    fontSize: 18,
  },
  inputTag: {
        marginTop: 15,
         color: 'white',
         fontSize: 13,
         textAlign: 'center'
      },

  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    width: 200,
    marginTop: 10,
    paddingLeft: 10,
  },
});
