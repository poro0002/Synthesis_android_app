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
import AccountChangeScreen from '../Screens/subScreens/ChangeAccount';
import PickElementScreen from '../Screens/subScreens/pickElementScreen';
import CustomDesignScreen from '../Screens/subScreens/CustomDesignScreen';
import DisplayCategory from '../Screens/subScreens/DisplayCategory';
import { BlurView } from 'expo-blur';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



const TabNavigator = ({ username }) => {

// the wrapper pretty much handles the props before hand so there is no issues passing props when the component is actually renders 

const HomeWrapper = (props) => {
  const { username } = props.route.params; 
  return <HomeScreen {...props} username={username} />;
};

function BlurTabBackground() {
  return (
    <BlurView tint="dark" intensity={130} style={StyleSheet.absoluteFill} />
  );
}


  return (
    <Tab.Navigator
    screenOptions={{
      headerTransparent: true,
      headerBackground: () => (
        <BlurView tint="dark" intensity={130} style={StyleSheet.absoluteFill} />
      ),
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'white',
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
      },
      tabBarBackground: () => <BlurView tint="dark" intensity={130} style={StyleSheet.absoluteFill} />,
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#aaa',
    }}
  >
      <Tab.Screen
        name="Home"
        component={HomeWrapper} 
        initialParams={{ username }} //  You use initialParams to pass data into a screen before the screen is rendered. // This is where `username` is passed to the `HomeWrapper` component
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
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = ({ username }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
  screenOptions={{
    headerTransparent: true,
    headerBackground: () => (
      <BlurView tint="dark" intensity={130} style={StyleSheet.absoluteFill} />
    ),
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
  }}
>
        <Stack.Screen
          name="Tabs"
          children={() => <TabNavigator username={username}/>}
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
        component={SettingScreen}
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
                <Stack.Screen name="AccountChangeScreen" 
        component={AccountChangeScreen} 
         
        />

        <Stack.Screen name="PickElementScreen" 
        component={PickElementScreen} 
        options={({ route }) => ({
          title: route.params?.category || 'Category', 
        })}
         
        />

      <Stack.Screen name="CustomDesignScreen" 
        component={CustomDesignScreen} 
         
        /> 

     <Stack.Screen name="DisplayCategory" 
        component={DisplayCategory} 
        options={({ route }) => ({
          title: route.params?.category || 'Category', 
        })}
         
        /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator ;
