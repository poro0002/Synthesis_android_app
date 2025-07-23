import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';



const apiUrl = Constants.expoConfig.extra.API_URL; 


// ------------------------------------------< REACT CONTEXT PATTERN API >-----------------------------------------------


export const LogContext = createContext();

export const LogProvider = ({ children }) => {




  
  // global use states as the log provider is wrapped around the app 
  const [designSystemData, setDesignSystemData] = useState([]);
  const [username, setUsername] = useState(null); // Add if needed
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [favData, setFavData] = useState([]);
  const [compData, setCompData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  console.log('isLoggedIn on context pattern:', isLoggedIn)


  useEffect(() => {
    setErrorMessage("");
  }, [isLoggedIn]);



const [selectedElements, setSelectedElements] = useState({
  fonts: [],
  gradients: [],
  typography: [],
  icons: [],
  comp: [],
  name: [],
  about: [],
});


// ------------------------------< Format Token Studio JSON Structure >------------------------------------------

const formatAndSaveTokens = async (selectedElements, systemId, username) => {

  const tokenData = { global: {} }

  console.log('formatAndSaveTokens called with:', {
      systemId,
      username,
      selectedElements
});

  // ── COLORS  ──
  if (selectedElements.gradients.length) {
    tokenData.global.colors = {}
    selectedElements.gradients.forEach(grad => {
      const key = grad.name.replace(/\s+/g, '')
      tokenData.global.colors[`${key}Primary`] = {
        value: grad.primary,
        type: 'color',
        description: grad.description || ''
      }
      tokenData.global.colors[`${key}Secondary`] = {
        value: grad.secondary,
        type: 'color'
      }
    })
  }

  // ── TYPOGRAPHY SCALES ──
  if (selectedElements.typography.length && selectedElements.fonts.length) {
    tokenData.global.typography = {}
    const fontName = selectedElements.fonts[0].name

    selectedElements.typography[0].styles.forEach(style => {
      tokenData.global.typography[style.label] = {
        value: {
          fontSize:   `${style.size}px`,
          fontFamily: fontName,
          lineHeight: '130%'
        },
        type: 'typography'
      }
    })

    // ── FONT FAMILY TOKENS ──
    tokenData.global.fontFamilies = {
      [fontName]: {
        value: fontName,
        type: 'font',
        description: selectedElements.fonts[0].description || ''
      }
    }
  }


  try {
    const response = await fetch(`${apiUrl}/saveTokenJson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ tokenData, systemId, username })
    })

    const result = await response.json()
    if (result.success) {
      console.log('Tokens saved:', result.message)
    } else {
      console.error('Save failed:', result.message)
    
    }
  } catch (err) {
    console.error('Error sending tokens to server:', err)
   
  }
}











// ------------------------------< JWT Authentication >------------------------------------------



// ------------------< Decode  Token >--------------------
// had get ai to write me a decode token function because the npm install jwtDecode package would just be undefined everytime smh 

const decodeJwt = (token)=> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
}

// ------------------< test Token >--------------------

const testToken = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  if (!token) {
    setIsLoggedIn(false);
    return;
  }

  // Decode basically makes it so you can read the encrypted jwt code that you got from the server, on the client side and read it without having to fetch again
  try {
    const decoded = decodeJwt(token);  // <== capture decoded JWT here
    if (!decoded) {
      setIsLoggedIn(false);
      return;
    }
    const currentTime = Date.now() / 1000; 

    // decoded.exp = 1752784400 // means: "this token expires at this exact second"
    // so decoded.exp is giving you a future timestamp to compare to the current time

    if (decoded.exp < currentTime) { // this runs true when the current time runs past that decoded.exp timestamp (hence token expired)
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [{ text: "OK", onPress: () => setIsLoggedIn(false) }]
      );
      return;
    }
  } catch (err) {
    console.error('Error decoding token:', err);
    setIsLoggedIn(false);
    return;
  }

  // If token looks valid, verify it with the backend
  const fetchURL = `${apiUrl}/testToken`;
  
  const fetchHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const fetchOptions = {
    method: "GET",
    headers: fetchHeaders,
    mode: 'cors',
  };

  try {
    const response = await fetch(fetchURL, fetchOptions);
    const data = await response.json();

    if (data.success) {
      console.log(data.message);
    } else {
      console.log(data.message);
      setIsLoggedIn(false);
      Alert.alert('Session expired', 'Please log in again.')

    }
  } catch (err) {
    console.log('There was an error with the test token fetch:', err);
    setIsLoggedIn(false);
  }
};

// ------------------< Get Token >--------------------

const getToken = async () => {

    const fetchURL = `${apiUrl}/token`;
    const fetchHeaders = new Headers({'Content-Type': 'application/json'});

  const fetchOptions = {
      method: "GET",
      headers: fetchHeaders,
      mode: 'cors',
  }


  try{
  
    const response = await fetch(fetchURL, fetchOptions);

    let data = await response.json();

    if(data.success){
       console.log(data.message)
       await SecureStore.setItemAsync('jwt', data.token);


    }else{
      console.log(data.message)
    }
    

  }catch(err){
    console.log('there was an error with the get token fetch', err)
  }

  // save the token in secureStore

}




// ------------------------------< Check Login Status >------------------------------------------


const checkLogin = async () => {
  try {
    const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
    const storedUsername = await AsyncStorage.getItem('username');

    setIsLoggedIn(prev => {
      //  only update if value has changed
      if (loggedInStatus === 'true' && !prev) return true;
      if (loggedInStatus !== 'true' && prev) return false;
      return prev;
    });

    setUsername(prev => {
      //  only update if username has changed
      if (storedUsername && prev !== storedUsername) return storedUsername;
      return prev;
    });

  } catch (error) {
    console.error("Error checking login status:", error);
  }
};



useEffect(() => {
  checkLogin();
}, []);



  // get the saved design systems from the backend
  // designSystemData gets set every time this function runs


  // useEffect(() => {
  //   console.log('react context favData updated:', favData);
  // }, [favData]);


  const getUpdatedUsername = async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    setUsername(storedUsername);
  }




 // ------------------------------< Handle Viewing Elements >------------------------------------------

 const handleViewElement = (navigation, element, type) => {
  navigation.navigate('Element',{
    element, 
    type
  }) 
 
}

const handleIconElement = (navigation, iconType, type) => {
  navigation.navigate('Element', {
    iconType,
    type
  });
}


const handleTypoElement = (navigation, type, data) => {
  navigation.navigate('Element', {
      type,
      data: [data],
    });


};

const handleCompElement = (navigation, type, data) => {
    navigation.navigate('Element', { 
      type,
      data, 
    });


};

 // ------------------------------< Fetch Category Data >------------------------------------------

 const fetchCategoryData = async (category) => {
  
  setLoading(true);
  setCompData(null);

  const fetchURL = `${apiUrl}/pickElement?category=${category}`;
  const fetchHeaders = new Headers({'Content-Type': 'application/json'});

  const fetchOptions = {
      method: "GET",
      headers: fetchHeaders,
      mode: 'cors',
  }

  try{
      let response = await fetch(fetchURL, fetchOptions);

      let data = await response.json();

      setCompData(data)


  }catch(err){
      console.log("there was an error with the fetch", err)
  }finally {
    setLoading(false);
  }

 } 


 // -----------------------------------< Get Payload Data >------------------------------------------  

    const getPayloadData = ({ type, data, element, iconType }) => {
       if(type === 'font' || type === 'color'){
        return {type, element, data: null, iconType: null }
       } else if(type === 'icon'){
        return {type, iconType, element: null, data: null}
       }else if(type === 'typography'){
          return {type, data, element: null, iconType: null}
       }else if(type === 'component'){
          return {type, data, element: null, iconType: null}
       }
    };
  
// -----------------------------------< CheckFavorites >------------------------------------------  

  const checkFavorites = async (payload = {}) =>{ // if there is no payload the function just returns the favData
    console.log('checking favorites');
    
    const storedUsername = await AsyncStorage.getItem('username');
    setUsername(storedUsername);

    const fetchUrl = `${apiUrl}/checkFavorites`;
    const fetchHeader = new Headers({ 'Content-Type': 'application/json' });

    const fetchOptions = {
      method: 'POST',
      headers: fetchHeader,
      mode: 'cors',
      body: JSON.stringify({
         username: storedUsername,
         payload, 
      })
    };

 
    try {

      let response = await fetch(fetchUrl, fetchOptions);

      let data = await response.json();

      if(data.success){
        console.log(data.message)
        return true;
      } else if('Favorites data returned'){
        console.log(data.message)
        setFavData(data.favData)
      }
        else {
        console.log(data.message)
        return false;
      }
    
 
    }catch(err){
      console.log('Error with the fetch:', err);
    }


  }

  // -----------------------------------< Create/Cancel System >------------------------------------------  

  const createSystem = async () => {
    setErrorMessage("");
    setLoading(true)
  
    const storedUsername = await AsyncStorage.getItem("username");
    setUsername(storedUsername);
  
    const name = selectedElements.name[0]?.trim(); // clean input
  
    // check to make sure each category has at least 1 element selected
    if (
      selectedElements.comp.length < 1 ||
      selectedElements.fonts.length < 1 ||
      selectedElements.gradients.length < 1 ||
      selectedElements.icons.length < 1 ||
      selectedElements.typography.length < 1
    ) {
      setErrorMessage("Make sure you have selected at least 1 element in every section.");
      return false;
    }
  
    // check to make sure there is a name for the system
    if (!name) {
      setLoading(false);
      setErrorMessage("You must have a name for your design system.");
      return false;
    }
  
    const cleanElements = {
      comp: selectedElements.comp,
      fonts: selectedElements.fonts,
      gradients: selectedElements.gradients,
      icons: selectedElements.icons,
      typography: selectedElements.typography.flat(),
      name,
      about: selectedElements.about?.[0] || "",
    };
  
    const fetchUrl = `${apiUrl}/saveDesignSystem`;
  
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ data: cleanElements, username }),
    };
  
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      const data = await response.json();
  
      if (data.success) {
        setErrorMessage(data.message); // success feedback

        console.log('About to call formatAndSaveTokens with:', {
             systemId: data.systemId,
             username,
             selectedElements
          });

        await formatAndSaveTokens(selectedElements, data.systemId, username);
        setLoading(false)
  
        setSelectedElements({
          fonts: [],
          gradients: [],
          typography: [],
          icons: [],
          comp: [],
          name: [],
          about: [],
        });
  
        return true;
      }
    } catch (err) {
      console.error("Error saving design system:", err);
      setErrorMessage("Failed to save design system. Please try again.");
      setLoading(false);
    }
  
    return false; // if all else fails return false so the navigation doesn't happen
  };


  // ------------------------------< Toggle Selection >------------------------------------------

  const toggleSelection = (type, element) => {

     setSelectedElements((prevState) => {
     
      // matches type and updates the name or about data(which is value with a onChange func) on the input
       if (type === 'name' || type === 'about') {
         return { ...prevState, [type]: [element] }; 
       }

       //comp does not have a name property so it needs its own base case
       if(type === 'comp'){

        const isCompSelected = prevState[type].some((item) => item.package === element.package);
        
        return {
          ...prevState, [type]: isCompSelected ? prevState[type].filter((item) => item.package !== element.package) : [...prevState[type], element],
        };

       }

       // basically this checks the previous selectedElements state with the type key ex [gradients]
       // .some() if any of them match what is already gradient array it means its already selected
       const isSelected = prevState[type].some((item) => (item.name && element.name && item.name === element.name));
   
       // [type] dynamic key (used to overwrite this one part of the state)
       // this  ...prevState ----> 
       // {
       //  gradients: [...],
       //  icons: [...],
       //  fonts: [...],
       //   etc: ...
       //   }
 
       //this [type]: ... ----> gradients: ...
       // ----->  isSelected checks if it was already selected before the click. <------
 
       //example adding a element
       // type = "gradients"
       // isSelected = false
       // if both these above pass, it adds a gradient to the selectedItems gradient object state 
      
        // When isSelected is true (the element is already selected), you want to remove it from the list — that’s the “toggle off” or deselect action.
        // so, true that returns an array filtering all the ones that aren't equal 
        
        // When isSelected is false (the element is not selected), you want to add it — that’s the “toggle on” or select action.

       return {
         ...prevState, [type]: isSelected ? prevState[type].filter((item) => item.name !== element.name) : [...prevState[type], element],
       };


     });
   };


// -----------------------------------< Get Design System >------------------------------------------  
  

  const getDesignSystem = async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    setUsername(storedUsername);
    
    const fetchUrl = `${apiUrl}/saved?username=${encodeURIComponent(storedUsername)}`;
    const fetchHeader = new Headers({ 'Content-Type': 'application/json' });

    const fetchOptions = {
      method: 'GET',
      headers: fetchHeader,
      mode: 'cors',
    };
 
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      const data = await response.json();
      // console.log('logContext fetched data:', data);
 


      if (Array.isArray(data)) {
        const updatedData = data.map(item => ({
          ...item,
          username: storedUsername, // Overwrite the old username in each item if its been changed 
        }));
        setDesignSystemData(updatedData);
      } else {
        console.error('Expected data to be an array, got:', data);
        setDesignSystemData([]);
      }
    } catch (err) {
      console.log('Error with the fetch:', err);
    }
  };

// -----------------------------------< Children >------------------------------------------  


  // useMemo is a React hook that memoizes (remembers) the result of a function so that it only recomputes when its dependencies change.
  
  const memoizedContext = useMemo(() => ({
    isLoggedIn,
    username,
    selectedElements,
    setSelectedElements,
  }), [isLoggedIn, username, selectedElements, setSelectedElements]);



  const otherContextValues = {
    setUsername,
    setIsLoggedIn,
    designSystemData,
    setDesignSystemData,
    getDesignSystem,
    getUpdatedUsername,
    checkFavorites,
    getPayloadData,
    favData,
    createSystem,
    errorMessage, 
    setErrorMessage,
    toggleSelection,
    handleViewElement,
    handleIconElement,
    handleTypoElement,
    handleCompElement,
    fetchCategoryData,
    compData,
    setCompData,
    loading,
    testToken,
    getToken,
   
  };

   // -----------------------------------< Return JSX >------------------------------------------  

  return (
    <LogContext.Provider
      value={{ // these values are the children 
        ...memoizedContext,
        ...otherContextValues,
      }}
    >
      {children} 
    </LogContext.Provider>
  );
};

export const useAuth = () => useContext(LogContext);

