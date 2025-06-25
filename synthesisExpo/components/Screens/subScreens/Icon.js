import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather, FontAwesome5 } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { MaterialIcons } from '@expo/vector-icons';

import { useRoute } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';

import globalStyles from '../../../styles';

const iconData = {
  feather: {
    title: 'Feather Icons',
    description: [
      'Feather icons are simple, lightweight, and minimalist.',
      'Their design philosophy prioritizes clarity and subtlety, making them ideal for modern and clean interfaces.',
      '• Minimalist designs.',
      '• Clean and flat aesthetics.',
      '• Applications focused on lightweight performance.',
    ],
    image: require('../../../assets/feather-logo.png'),
  },
  evil: {
    title: 'Evil Icons',
    description: [
      'Evil Icons are simple and easy to use, providing minimal yet clear representation of actions and status.',
      'They work well in user interfaces that prioritize user interaction without overloading the design.',
      '• Simple, intuitive icons for quick recognition.',
      '• Perfect for action-oriented designs.',
      '• Best for minimalistic interfaces.',
    ],
    image: require('../../../assets/evil-logo.jpeg'),
  },
  simple: {
    title: 'Simple Line Icons',
    description: [
      'Simple Line Icons are elegant, thin, and have clean outlines.',
      'They are ideal for sleek, modern UIs where subtle and refined visuals are required.',
      '• Elegant, thin icons with clean outlines.',
      '• Ideal for sleek and modern UIs.',
      '• Perfect for web and mobile applications.',
    ],
    image: require('../../../assets/simple-logo.png'),
  },
  octicons: {
    title: 'Octicons',
    description: [
      'Octicons are designed specifically for GitHub and related platforms, providing simple, easy-to-read icons.',
      'Great for developer tools and platforms.',
      '• Works well with repositories and codebases.',
      '• Clean, clear icons for action buttons.',
    ],
    image: require('../../../assets/octicons-logo.png'),
  },
  ionicons: {
    title: 'Ionicons',
    description: [
      'Ionicons are versatile icons with a focus on simplicity.',
      'They provide a cohesive design style, great for mobile apps and modern web interfaces.',
      '• Versatile and widely used for mobile interfaces.',
      '• Clean and consistent design language.',
      '• Great for responsive design and apps.',
    ],
    image: require('../../../assets/ionicons-logo.png'),
  },
  Fontawesome: {
    title: 'FontAwesome Icons',
    description: [
      'FontAwesome provides an extensive library of icons for a wide variety of use cases.',
      'From basic actions to detailed indicators, FontAwesome has a vast range that fits almost any design need.',
      '• Huge selection of icons for all kinds of needs.',
      '• Ideal for both web and mobile design.',
      '• Highly customizable and scalable icons.',
    ],
    image: require('../../../assets/fontawesome-logo.png'),
  },
  material: {
    title: 'Material Icons',
    description: [
      'Material Icons are designed by Google and offer consistency with Android’s Material Design principles.',
      'They are clean, easy to understand, and provide a high-quality visual experience across all screen sizes.',
      '• Designed for Android and Material Design systems.',
      '• Clean, easy-to-read icons.',
      '• Consistent look across mobile and web interfaces.',
    ],
    image: require('../../../assets/material-logo.png'),
  },
};

const Icon = ({ type, minimal = false  }) => {

  const route = useRoute(); 

  const iconComponents = {  // these here just hold the imported react-native-vector-icons in a object with corro names
    feather: Feather,
    Fontawesome: FontAwesome5,
    ionicons: Ionicons,
    evil: EvilIcons,
    simple: SimpleLineIcons,
    octicons: Octicons,
    material: MaterialIcons,
  };

  // const obj = { evil: 'EvilIcons' };
 //  console.log(obj['evil']); 
  // JavaScript objects behave like key-value stores (or dictionaries), and they allow two ways to access properties:
  // This works only for fixed property names—you must know the property name in advance.

// ^^^^^^^^
  const IconComponent = iconComponents[type]; // type is the universal parameter and this becomes the universal component that renders the icon
  // ^^^ this variable pretty much goes from an obj into a component
  const data = iconData[type];

  if (!data) {
    return <Text style={{ color: 'red' }}>Invalid icon type</Text>;
  }

  return (
  <View style={{ alignItems: 'center' }}>
    { minimal || route.name === 'MyDesignScreen' ? (
      // Render this if coming from "MyDesignScreen"
        <IconComponent size={30} name='folder' style={styles.icon} color="royalblue" />
    ) : (
      // Else render this
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={data.image} style={styles.logo} />
        <Text style={[styles.title, globalStyles.screenStyles.textShadow]}>{data.title}</Text>
        <Text style={styles.subtitle}>Why use them?{"\n"}</Text>
        {data.description.map((bullet, index) => (
          <Text key={index} style={styles.description}>{bullet}</Text>
        ))}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconContainer}>
          {['search', 'home', 'folder', 'settings', 'user'].map((icon, index) => ( 
            <IconComponent key={index} name={icon} size={50} style={styles.icon} color="royalblue" />
          ))}
        </ScrollView>
      </View>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  logo: { width: 100, height: 100, margin: 30 },
  title: { color: 'white', fontSize: 35 },
  subtitle: { color: 'white', fontSize: 20, marginTop: 20 },
  description: { color: 'white', fontSize: 13, textAlign: 'center', marginTop: 10 },
  iconContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { margin: 20 },
});

export default Icon;