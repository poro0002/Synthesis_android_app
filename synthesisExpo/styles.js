import { StyleSheet } from 'react-native';


// Define your fonts here
// export const fonts = {
//   AbrilFatface: { fontFamily: 'AbrilFatface-Regular' },
//   AlfaSlabOne: { fontFamily: 'AlfaSlabOne-Regular' },
//   AmaticSC: { fontFamily: 'AmaticSC-Regular' },
//   Anton: { fontFamily: 'Anton-Regular' },
//   Arimo: { fontFamily: 'Arimo-VariableFont_wght' },
//   BebasNeue: { fontFamily: 'BebasNeue-Regular' },
//   Cormorant: { fontFamily: 'Cormorant-VariableFont_wght' },
//   CrimsonText: { fontFamily: 'CrimsonText-Regular' },
//   DancingScript: { fontFamily: 'DancingScript-VariableFont_wght' },
//   Exo: { fontFamily: 'Exo-VariableFont_wght' },
//   FiraSans: { fontFamily: 'FiraSans-Regular' },
//   JosefinSans: { fontFamily: 'JosefinSans-VariableFont_wght' },
//   Kreon: { fontFamily: 'Kreon-VariableFont_wght' },
//   Lato: { fontFamily: 'Lato-Regular' },
//   LibreBaskerville: { fontFamily: 'LibreBaskerville-Regular' },
//   LibreFranklin: { fontFamily: 'LibreFranklin-VariableFont_wght' },
//   Lobster: { fontFamily: 'Lobster-Regular' },
//   Lora: { fontFamily: 'Lora-VariableFont_wght' },
//   MavenPro: { fontFamily: 'MavenPro-VariableFont_wght' },
//   Merriweather: { fontFamily: 'Merriweather-Regular' },
//   Montserrat: { fontFamily: 'Montserrat-VariableFont_wght' },
//   Mulish: { fontFamily: 'Mulish-VariableFont_wght' },
//   NotoSans: { fontFamily: 'NotoSans-VariableFont_wdth,wght' },
//   Nunito: { fontFamily: 'Nunito-VariableFont_wght' },
//   Oswald: { fontFamily: 'Oswald-VariableFont_wght' },
//   Pacifico: { fontFamily: 'Pacifico-Regular' },
//   PlayfairDisplay: { fontFamily: 'PlayfairDisplay-VariableFont_wght' },
//   Poppins: { fontFamily: 'Poppins-Regular' },
//   PTSans: { fontFamily: 'PTSans-Regular' },
//   Quicksand: { fontFamily: 'Quicksand-VariableFont_wght' },
//   Rajdhani: { fontFamily: 'Rajdhani-Regular' },
//   Raleway: { fontFamily: 'Raleway-VariableFont_wght' },
//   Roboto: { fontFamily: 'Roboto-Regular' },
//   SourceSans3: { fontFamily: 'SourceSans3-VariableFont_wght' },
//   Teko: { fontFamily: 'Teko-VariableFont_wght' },
//   TitilliumWeb: { fontFamily: 'TitilliumWeb-Regular' },
//   Ubuntu: { fontFamily: 'Ubuntu-Regular' },
//   VarelaRound: { fontFamily: 'VarelaRound-Regular' },
//   WorkSans: { fontFamily: 'WorkSans-VariableFont_wght' },
// };



const globalStyles = StyleSheet.create({
    screenStyles: {
        container: {
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            backgroundColor: 'black',
          
          
        },
        centerContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: 'black',
        
        
      },
        centerColumn: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          backgroundColor: 'black',
        },
        centerRow: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: 'black',
        },
          h1: {
            fontSize: 32,
            fontWeight: 'bold',
            color: 'white',
            marginVertical: 10,
            marginBottom: 10,
          },
          h2: {
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginVertical: 8,
            marginBottom: 10,
          },
          h3: {
            fontSize: 24,
            fontWeight: '600',
            color: 'white',
            marginVertical: 6,
            marginBottom: 10,
          },
          h4: {
            fontSize: 20,
            fontWeight: '500',
            color: 'white',
            marginVertical: 4,
            marginBottom: 10,
          },

        text: {
            fontSize: 18,
            color: 'white',
            textAlign: 'center',
            marginBottom: 15,
            marginTop: 15,
            
           
           
        },
      topicContainer:{
              flex: 1,
              padding: 10,

         },
          row: {
             flexDirection: 'row', // Align children in a row
             justifyContent: 'space-between', // Space evenly between items
             marginBottom: 30, // Space between rows
             flexWrap: 'wrap', 
           },
         column: {
               flexDirection: 'column', // Align children in a row
               justifyContent: 'center', // Space evenly between items
               
               marginTop: 100, // Space between rows
              
             },
        topicComp:{
            flex: 1,
            margin: 5,
            fontSize: 15,
            marginHorizontal: 5,
            backgroundColor: 'white',
            borderRadius: 30,
            color: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 9,
            paddingBottom: 9,
            paddingLeft: 10,
            paddingRight: 10,
           

        },
          topicText: {
            fontSize: 14, // Text size for readability
            color: "black", // Bold text
            fontFamily: 'AbrilFatface-Regular',
          },

        popularComp:{
            fontSize: 24,
            backgroundColor: 'white',
            marginHorizontal: 5,
            borderRadius: 5,
            color: 'black',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
            width:125,
            height:125,
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

        recentlyComp: {
            fontSize: 24,
            backgroundColor: 'white',
            borderRadius: 85,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
            width:85,
            height:85,
            margin: 10,

        },

        settingsComp:{
          height: 50,
          margin: 5,
          fontSize: 15,
          marginHorizontal: 5,
          backgroundColor: 'white',
          borderRadius: 30,
          color: 'black',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 7,
          paddingBottom: 7,
          paddingLeft: 10,
          paddingRight: 10,
        },
        viewBtn:{
          height: 30,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          margin:5,
          borderRadius: 3,
        },
        fab: {
          position: 'absolute', // Position it absolute to the container
          top: 15, // Distance from the bottom
          right: 30, // Distance from the right
          
          borderRadius: 50, // Makes it round
          shadowColor: '#fff', // Shadow color
          shadowOffset: { width: 0, height: 2 }, // Shadow offset
          shadowOpacity: 0.2, // Shadow opacity
          shadowRadius: 3, // Shadow radius
          elevation: 5, // Android shadow
          padding: 10, // Padding around the icon
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
        btn1:{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: 150,
          height: 50,
          borderRadius: 10,
          margin: 20
        },
        scrollContainer: {
          flexDirection: 'row', // Layout items in a row for horizontal scrolling
          padding: 10,
        },
        item: {
          width: 100,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10, // Space between items
        },
        box: {
          width: 120,
          height: 120,
          borderRadius: 10,
          margin:5,
          borderWidth: 2,
          borderColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          position: 'relative', // For positioning the circle in the corner
        },
        checkCircle: {
          width: 20,
          height: 20,
          borderRadius: 10, // Fully rounded
          borderWidth: 2,
          borderColor: 'black',
          position: 'absolute',
          top: 0,
          left: 70,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          zIndex: 1,
        },
        filledCircle: {
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: 'orange', // orange fill when checked
          zIndex: 1
        },

    }, // screen styles end
  
});

export default globalStyles;