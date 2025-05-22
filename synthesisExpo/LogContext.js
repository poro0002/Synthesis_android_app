import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';


export const LogContext = createContext();

export const LogProvider = ({ children }) => {

  // global use states as the log provider is wrapped around the app 
  const [designSystemData, setDesignSystemData] = useState([]);
  const [username, setUsername] = useState(null); // Add if needed
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Optional


const apiUrl = Constants.expoConfig.extra.API_URL; 

  const logout = async () => {
    await AsyncStorage.removeItem('username');
    setUsername(null);
    setIsLoggedIn(false);
  };

  // get the saved design systems from the backend
  // designSystemData gets set every time this function runs

  const getDesignSystem = async () => {
    const username = await AsyncStorage.getItem('username');
    
    const fetchUrl = `${apiUrl}/saved?username=${encodeURIComponent(username)}`;
    const fetchHeader = new Headers({ 'Content-Type': 'application/json' });

    const fetchOptions = {
      method: 'GET',
      headers: fetchHeader,
      mode: 'cors',
    };
 
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      const data = await response.json();
      console.log('logContext fetched data:', data);
 


      if (Array.isArray(data)) {
        setDesignSystemData(data);
      } else {
        console.error('Expected data to be an array, got:', data);
        setDesignSystemData([]);
      }
    } catch (err) {
      console.log('Error with the fetch:', err);
    }
  };

  return (
    <LogContext.Provider
      value={{ // these values are the children 
        logout,
        username,
        setUsername,
        isLoggedIn,
        setIsLoggedIn,
        designSystemData,
        setDesignSystemData,
        getDesignSystem,
      }}
    >
      {children} 
    </LogContext.Provider>
  );
};

export const useAuth = () => useContext(LogContext);