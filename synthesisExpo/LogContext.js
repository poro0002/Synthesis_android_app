import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';


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



const apiUrl = Constants.expoConfig.extra.API_URL; 

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

