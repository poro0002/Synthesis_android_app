import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
  Switch // A toggle component for binary options (on/off)
} from 'react-native';

import * as Font from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNavigator from './components/Routes/TabNavigator';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';
enableScreens(); // <---- It improves performance by reducing memory usage and optimizing the screen management lifecycle, especially when dealing with multiple screens.

import 'react-native-gesture-handler';

  // Importing all fonts
  import AbrilFatface from './assets/fonts/Abril_Fatface/AbrilFatface-Regular.ttf';
  import AlfaSlabOne from './assets/fonts/Alfa_Slab_One/AlfaSlabOne-Regular.ttf';
  import AmaticSC from './assets/fonts/Amatic_SC/AmaticSC-Regular.ttf';
  import Anton from './assets/fonts/Anton/Anton-Regular.ttf';
  import Arimo from './assets/fonts/Arimo/Arimo-VariableFont_wght.ttf';
  import BebasNeue from './assets/fonts/Bebas_Neue/BebasNeue-Regular.ttf';
  import Cormorant from './assets/fonts/Cormorant/Cormorant-VariableFont_wght.ttf';
  import CrimsonText from './assets/fonts/Crimson_Text/CrimsonText-Regular.ttf';
  import DancingScript from './assets/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf';
  import Exo from './assets/fonts/Exo/Exo-VariableFont_wght.ttf';
  import FiraSans from './assets/fonts/Fira_Sans/FiraSans-Regular.ttf';
  import JosefinSans from './assets/fonts/Josefin_Sans/JosefinSans-VariableFont_wght.ttf';
  import Kreon from './assets/fonts/Kreon/Kreon-VariableFont_wght.ttf';
  import Lato from './assets/fonts/Lato/Lato-Regular.ttf';
  import LibreBaskerville from './assets/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf';
  import LibreFranklin from './assets/fonts/Libre_Franklin/LibreFranklin-VariableFont_wght.ttf';
  import Lobster from './assets/fonts/Lobster/Lobster-Regular.ttf';
  import Lora from './assets/fonts/Lora/Lora-VariableFont_wght.ttf';
  import MavenPro from './assets/fonts/Maven_Pro/MavenPro-VariableFont_wght.ttf';
  import Merriweather from './assets/fonts/Merriweather/Merriweather-Regular.ttf';
  import Montserrat from './assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf';
  import Mulish from './assets/fonts/Mulish/Mulish-VariableFont_wght.ttf';
  import NotoSans from './assets/fonts/Noto_Sans/NotoSans-VariableFont_wdth,wght.ttf';
  import Nunito from './assets/fonts/Nunito/Nunito-VariableFont_wght.ttf';
  import Oswald from './assets/fonts/Oswald/Oswald-VariableFont_wght.ttf';
  import Pacifico from './assets/fonts/Pacifico/Pacifico-Regular.ttf';
  import PlayfairDisplay from './assets/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf';
  import Poppins from './assets/fonts/Poppins/Poppins-Regular.ttf';
  import PTSans from './assets/fonts/PT_Sans/PTSans-Regular.ttf';
  import Quicksand from './assets/fonts/Quicksand/Quicksand-VariableFont_wght.ttf';
  import Rajdhani from './assets/fonts/Rajdhani/Rajdhani-Regular.ttf';
  import Raleway from './assets/fonts/Raleway/Raleway-VariableFont_wght.ttf';
  import Roboto from './assets/fonts/Roboto/Roboto-Regular.ttf';
  import SourceSans3 from './assets/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf';
  import Teko from './assets/fonts/Teko/Teko-VariableFont_wght.ttf';
  import TitilliumWeb from './assets/fonts/Titillium_Web/TitilliumWeb-Regular.ttf';
  import Ubuntu from './assets/fonts/Ubuntu/Ubuntu-Regular.ttf';
  import VarelaRound from './assets/fonts/Varela_Round/VarelaRound-Regular.ttf';
  import WorkSans from './assets/fonts/Work_Sans/WorkSans-VariableFont_wght.ttf';

  

function App() {
  // States to manage whether login or register is clicked
  const [logClicked, setLogClicked] = useState(false);
  const [regClicked, setRegClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Separate state objects for login and register form data
  const [logData, setLogData] = useState({ username: '', pass: '' });
  const [regData, setRegData] = useState({ username: '', pass: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');

  const [fontsLoaded, setFontsLoaded] = useState(false);


  // Load all fonts with expo-font
  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        AbrilFatface: AbrilFatface,
        AlfaSlabOne: AlfaSlabOne,
        AmaticSC: AmaticSC,
        Anton: Anton,
        Arimo: Arimo,
        BebasNeue: BebasNeue,
        Cormorant: Cormorant,
        CrimsonText: CrimsonText,
        DancingScript: DancingScript,
        Exo: Exo,
        FiraSans: FiraSans,
        JosefinSans: JosefinSans,
        Kreon: Kreon,
        Lato: Lato,
        LibreBaskerville: LibreBaskerville,
        LibreFranklin: LibreFranklin,
        Lobster: Lobster,
        Lora: Lora,
        MavenPro: MavenPro,
        Merriweather: Merriweather,
        Montserrat: Montserrat,
        Mulish: Mulish,
        NotoSans: NotoSans,
        Nunito: Nunito,
        Oswald: Oswald,
        Pacifico: Pacifico,
        PlayfairDisplay: PlayfairDisplay,
        Poppins: Poppins,
        PTSans: PTSans,
        Quicksand: Quicksand,
        Rajdhani: Rajdhani,
        Raleway: Raleway,
        Roboto: Roboto,
        SourceSans3: SourceSans3,
        Teko: Teko,
        TitilliumWeb: TitilliumWeb,
        Ubuntu: Ubuntu,
        VarelaRound: VarelaRound,
        WorkSans: WorkSans,
      });
      setFontsLoaded(true);
      console.log("Fonts loaded successfully");
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  };

  useEffect(() => {
    loadFonts(); // Load fonts when the app starts
  }, []);





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


//   ----------------------------< useEffect >--------------------------------------

// this checks the Async storage for a isLoggedIn Boolean as well as a username
//  this just checks the truthy and falsy of the variable so the app can cahnge accordingly
useEffect(() => {
        const checkUserLogged = async () =>{
                const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
                if (loggedInStatus === 'true') {
                       setIsLoggedIn(true)
                       const storedUsername = await AsyncStorage.getItem('username')
                       setUsername(storedUsername || "")
                    }
            }
        checkUserLogged()
    }, []);

// this constantly sets the username and isLogged in variable and sets it so its updated in the storage

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




     useEffect(() => {
          console.log('Login data:', logData);
      }, [logData]);

      useEffect(() => {
          console.log('Register data:', regData);
      }, [regData]);

     useEffect(() => {
            console.log('error changed', errorMessage);
        }, [errorMessage]);


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

// ------------< Register input value test functions >-------------------------

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


// ----------------------------< Handle Register >--------------------------------------

 const regSubmit = async () => {

    console.log('regSubmit fired', regData)
// the regData data needs to checkout against the rules before the api fetch is made


  if(testUsername(regData) && testPassword(regData) && testEmail(regData)){

      const registerURL = 'http://10.0.2.2:4500/register'; //
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

// ----------------------------< Handle Login >--------------------------------------

const logSubmit = async () => {


    console.log('logSubmit fired', logData)

 // do a fetch to the server side log route that includes a body with the log input values

      const logURL = 'http://10.0.2.2:4500/login'
      const logHeaders = new Headers({'Content-Type': 'application/json'});

      const logOptions = {
            method: 'POST',
            headers: logHeaders,
            mode: 'cors',
            body: JSON.stringify(logData)
          }

      try{
          const response = await fetch(logURL, logOptions)
//
//              if (!response.ok) {
//                         throw new Error('There was a problem with the register fetch');
//                          }

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
          console.error('Error during registration:', error);
         }

 // the log server route will test those values in the mongo database
 // make sure to lof the potential errors or response messages accordingly
 // redirect the user to their user profile after the successful login
 // make plans for whats next ?

    }


const logout = async () => {
    try {
        await AsyncStorage.clear();
        setIsLoggedIn(false);
        DevSettings.reload();
    } catch (e) {
        console.error('Error clearing AsyncStorage:', e);
    }
};


  // If fonts aren't loaded, show a loading indicator
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="orange" />
        <Text>Loading Fonts...</Text>
      </View>
    );
  }


// ----------------------------< Returned JSX >--------------------------------------
return (
 <>
    {isLoggedIn ? (
      <StackNavigator logout={logout} username={username} />
    ) : (
      <View style={styles.container}>
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
          <>
            <Text style={styles.header}>Login Form</Text>
            <Text style={styles.inputTag}>{errorMessage}</Text>
            <Text style={styles.inputTag}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={logData.username}
              onChangeText={(value) => handleLogInputChange('username', value)}
            />
            <Text style={styles.inputTag}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={logData.pass}
              onChangeText={(value) => handleLogInputChange('pass', value)}
            />
            <Pressable onPress={logSubmit} style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Submit Login</Text>
            </Pressable>
            <Pressable onPress={handleReg} style={({ pressed }) => [styles.buttonText, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Don't have an Account? Register</Text>
            </Pressable>
          </>
        )}

        {regClicked && (
          <>
            <Text style={styles.header}>Register Form</Text>
            <Text style={styles.inputTag}>{errorMessage}</Text>
            <Text style={styles.inputTag}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={regData.username}
              onChangeText={(value) => handleRegInputChange('username', value)}
            />
            <Text style={styles.inputTag}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={regData.pass}
              onChangeText={(value) => handleRegInputChange('pass', value)}
            />
          <Text style={styles.inputTag}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={regData.email}
              onChangeText={(value) => handleRegInputChange('email', value)}
            />
            <Pressable onPress={regSubmit} style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Submit Registration</Text>
            </Pressable>
            <Pressable onPress={handleLog} style={({ pressed }) => [styles.buttonText, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Already have an Account? Login</Text>
            </Pressable>
          </>
        )}
      </View>
    )}
  </>
);
};

// Export the component
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logBtn: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: 'orange',
    borderRadius: 7,
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
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: 'transparent',
     borderColor: 'orange',
      borderWidth: 3,
    padding: 10,
    borderRadius: 7,
  },
  buttonText: {
    color: 'white',
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
      },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
    width: 200,
    marginTop: 10,
    paddingLeft: 10,
  },
});



