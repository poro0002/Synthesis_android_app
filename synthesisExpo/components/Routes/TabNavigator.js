import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo vector icons

//screens
import HomeScreen from '../Screens/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import ProjectScreen from '../Screens/ProjectScreen';
import SettingScreen from '../Screens/SettingScreen';
import TopicScreen from '../Screens/subScreens/TopicScreen';
import ElementScreen from '../Screens/subScreens/ElementScreen';
import MyDesignScreen from '../Screens/subScreens/MyDesignScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SettingsWrapper = (props) => {
  const { logout } = props.route.params; 
  return <SettingScreen {...props} logout={logout} />;
};



const TabNavigator = ({ username, logout }) => {

// the wrapper pretty much handles the props before hand so there is no issues passing props when the component is actually renders 

const HomeWrapper = (props) => {
  const { username } = props.route.params; 
  return <HomeScreen {...props} username={username} />;
};


  return (
  <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeWrapper} 
        initialParams={{ username }} // 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Project"
        component={ProjectScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="work" color={color} size={size} />
          ),
        }}
      />
  <Tab.Screen
        name="Settings"
        component={SettingsWrapper} // Use SettingsWrapper
        initialParams={{ logout }} // Pass `logout` as initialParams
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = ({ username, logout }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          children={() => <TabNavigator username={username} logout={logout} />}
          options={{ headerShown: false }} // Hide header for the tab navigator
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerTitle: 'Home' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerTitle: 'Profile' }}
        />
        <Stack.Screen
          name="Project"
          component={ProjectScreen}
          options={{ headerTitle: 'Project' }}
        />
      <Stack.Screen
        name="Settings"
        component={SettingsWrapper}
        initialParams={{ logout }} 
        options={{ headerTitle: 'Settings' }}
      />
        <Stack.Screen name="Topic" 
        component={TopicScreen} 
         
        />
           <Stack.Screen name="Element" 
        component={ElementScreen} 
         
        />
             <Stack.Screen name="MyDesignScreen" 
        component={MyDesignScreen} 
         
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator ;
