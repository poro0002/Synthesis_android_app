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

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL; 

import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import LottieView from 'lottie-react-native';

import ErrorBoundary from './ErrorBoundary';
import { LogProvider} from './LogContext'; 
import LoginRegScreen from './components/Screens/LoginRegScreens/LoginRegScreen';


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

  const [fontsLoaded, setFontsLoaded] = useState(false);
   const [localLoading, setLocalLoading] = useState(false);

  // ----------------------------------------------------< Load Fonts/Video >--------------------------------------------------------
  
  
  const loadVideos = async () => {

    setLocalLoading(true)
    try {
      await Asset.loadAsync([
        require('./assets/gradient1.mp4'),
        require('./assets/gradient2.mp4'),
        require('./assets/gradient3.mp4'),
        require('./assets/gradient4.mp4'),
        require('./assets/gradient5.mp4'),
        require('./assets/jelly4.mp4'),
        require('./assets/fluid1.mp4'),
      ]);
      console.log('Videos preloaded successfully');
    } catch (error) {
      console.error('Error preloading videos:', error);
    }finally{
      setLocalLoading(false)
    }
  };


  const loadPhotos = async () => {

    setLocalLoading(true)
    try {
      await Asset.loadAsync([
        require('./assets/portfolio-projects/batman_mockup.png'),
        require('./assets/portfolio-projects/nike_x_off_white_iphone_mockup.png'),
        require('./assets/portfolio-projects/black-myth-mockups/Black Wukong Mockup.png'),
        require('./assets/portfolio-projects/dune/dune-screen-4.png'),
        require('./assets/portfolio-projects/nike-offwhite-mockups/Nike x Off White ipad mockup.png'),
        require('./assets/portfolio-projects/Smarthome Prototype/smartHUD mockup white.png'),
      ]);
      console.log('photos preloaded successfully');
    } catch (error) {
      console.error('Error preloading photos:', error);
    }finally{
      setLocalLoading(false)
    }
  };



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
  const loadAssets = async () => {
    await loadFonts();
    await loadVideos();
    await loadPhotos();
  };

  loadAssets();
}, []);


  // If fonts aren't loaded, show a loading indicator
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
             source={require('./assets/loading1.json')}
             autoPlay
             loop
             style={{ width: 100, height: 100, alignSelf: 'center'}}
           />
        <Text>Loading Assets...</Text>
      </View>
    );
  }


// ----------------------------------------------------< Returned JSX >------------------------------------------------------------------

return (
 <>

<LogProvider>
 <ErrorBoundary>
    {localLoading && fontsLoaded && (
            <Modal transparent={true} animationType="fade">
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                  <LottieView
                      source={require('./assets/loading1.json')}
                      autoPlay
                      loop
                      style={{ width: 100, height: 100, alignSelf: 'center'}}
                    />
                <Text style={{ color: 'white', marginTop: 10 }}>Loading assets...</Text>
              </View>
            </Modal>
        )}
      <LoginRegScreen />
    </ErrorBoundary>
  </LogProvider>
  </>
);
};

// Export the component
export default App;




