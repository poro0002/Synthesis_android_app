import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt';
import xss from 'xss';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import sgMail from "@sendgrid/mail";


import admin from 'firebase-admin'; // admin from firebase admin is a essential part of connecting to the db because it certifies your service account with your firebase project 
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, connectFirestoreEmulator } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const jwt_key = process.env.JWT_KEY;
const port = process.env.PORT || 4500;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const __filename = fileURLToPath(import.meta.url); // This line is used to get the absolute file path of the current module (the current JavaScript file) when using ES Modules (ESM) in Node.js.
const __dirname = path.dirname(__filename); // You can use this to reference the directory where the script is located, which can be useful when you need to resolve relative paths to files in the same directory or in subdirectories.


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));



app.use(express.json());

// -------------------------------------------------------< Database Connection >-----------------------------------------------------------

const serviceAccount = await import(`./synthesis-4c237-firebase-adminsdk-r8ea9-98574971f1.json`, {
  assert: { type: 'json' }
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default),
});

// once its initialized using th initializedApp() method you can access the firestore() property from admin and start saving data to the firestore db

// this must be global 
const firestore = admin.firestore();

// -----------------------------------------------------< Test Firebase Connection >------------------------------------------------------------

app.get('/test-firebase', async (req, res) => {
  console.log('Received request for /test-firebase');
  try {
    // Add a document to Firestore (for testing)
    const docRef = await firestore.collection('test').add({
      name: 'Sample Name',
      message: 'Hello, Firestore!',
    });

    // Read the newly added document
    console.log('Document added to Firestore');
    const doc = await firestore.collection('test').doc(docRef.id).get();
    
    if (doc.exists) {
      res.json(doc.data()); // If the document exists, return its data
    } else {
      res.json({ message: 'No document found!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error connecting to Firebase');
  }
});

// ---------------------------------------------------------< Port Connection >------------------------------------------------------------

app.listen(port, (err) => {
  if(err){
     console.log('error launching port', err)
     return
  } else{
     console.log(`listening on ${port}`)
  }

});

// ---------------------------------------------------------< JWT TOKEN >------------------------------------------------------------

app.get('/token', async (req, res) => {
  
// 1) Math.random() generates a pseudo-random number between 0 (inclusive) and 1 (exclusive).
// 2) .toString(36) converts it to a base36 string using 0-9 and a-z characters.
//    The result looks like "0.xyzabc..."
// 3) .substring(2, 8) removes the "0." and keeps the next 6 characters for a short ID.
// The final result is a 6-character random alphanumeric string (not cryptographically secure).

    let id = Math.random().toString(36).substring(2, 8);
    let token = jwt.sign({ _id: id }, jwt_key, { expiresIn: '4h' }); // let jwt handle exp
    
    return res.status(200).json({ token, message: 'token successfully created for user', success: true });




})


app.get('/testToken', async (req, res) => {

   const header = req.header('Authorization');
    // header is a string → "Bearer abc123"
    // header.split(' ') returns → ["Bearer", "abc123"] (an array)

    const [type, token] = header.split(' ');

   if(type === 'Bearer' & typeof token !== 'undefined'){

      try{
       let payload = jwt.verify(token, jwt_key); // should throw an error if the limit is expired
       // above returns   

       //payload = {
          //_id: "abc123",
          //exp: 1752770491,
          //iat: 1752770191 // auto-added by jwt
      // }

       let current = Math.floor(Date.now() / 1000)
       let diff = payload.exp - current;
       res.status(200).json({message: `token verified ${diff} remaining`, success: true})

      }catch(err){
        res.status(401).json({message: 'invalid or expired token', success: false})
      }
     
    }else{
      res.status(402).json({message: 'Invalid token', success: false})
    }

})

// ---------------------------------------------------------< Token Studios JSON >------------------------------------------------------------

app.post('/getTokenJson', async (req, res) => {

    // get the corro username, email, current system ID that the client has asked to export
    // use the username to get a ref or snapshot
    // if its .empty() write a base case for that 
    // go use that user ref to get the userRef.docs[0].ref.
    // await userRef.collection('tokenJson').where(id, "==", id).get() and get the specific data
    // 

    const { username, email, id } = req.body;

    console.log('getTokenJson  username:', username);
    console.log('getTokenJson email:', email);
    console.log('getTokenJson id:', id);

    try {

        const userRef = await firestore.collection('users').where('username', '==', username).get();

        if (userRef.empty) {
            return res.status(400).json({ message: 'could not find a user with that username', success: false });
        }

        const userDoc = userRef.docs[0].ref;

        const tokenJsonSnapshot = await userDoc.collection('tokenJson').where('id', '==', id).get();

        if (tokenJsonSnapshot.empty) {
            return res.status(404).json({ message: 'No token JSON data found for this system ID.', success: false });
        }

        // Firestore’s .where() queries always return a QuerySnapshot — even if only one document matches (or none at all). So the only way to access the matched docs is to iterate over them with .forEach() or access docs[0].
         // its looping over an array with one index [0] basically
       
        let tokenJsonData = null;
        tokenJsonSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.tokenData) {
                tokenJsonData = data.tokenData;
            }
        });

        if (!tokenJsonData) {
            return res.status(404).json({
                success: false,
                message: "Token JSON data not found in document."
            });
        }

        const jsonString = JSON.stringify(tokenJsonData, null, 2);

    const msg = {
      to: email,
      from: process.env.EMAIL_USER, // must be verified in SendGrid
      subject: "Your Design Token JSON Export",
      text: "Attached is your exported design token JSON, ready for import into Token Studio or Figma.",
      attachments: [
        {
          content: Buffer.from(jsonString).toString("base64"),
          filename: "design-tokens.json",
          type: "application/json",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    console.log(`✅ Token JSON data sent to ${email}`);
    
    return res.status(200).json({
      message: "Token JSON data found and sent to their email",
      success: true,
    });

    } catch (err) {
       console.error('🔥 Detailed error in /getTokenJson:', err);

        if (err.response && err.response.body) {
          console.error("📨 SendGrid response body:", err.response.body);
        }

      
        res.status(500).json({
            message: 'There was a problem accessing or sending the token JSON data for that user',
            success: false
        });
    }
});





app.post('/saveTokenJson', async (req, res) => {
  const { tokenData, username, systemId } = req.body;

  console.log('saveTokenJson tokenData:', tokenData);
  console.log('saveTokenJson systemId:', systemId);

  if (!username || !systemId) {
    return res.status(400).json({ success: false, message: 'username and systemId are required' });
  }

  try {
    const userRef = await firestore.collection('users').where('username', '==', username).get();

    if (userRef.empty) {
      return res.status(400).json({ message: 'No user found with that username', success: false });
    }

    const userDocRef = userRef.docs[0].ref;
    const tokenJsonRef = userDocRef.collection('tokenJson');
    
    // Check if there's already a token JSON with the same ID (systemId)
    const existingTokenQuery = await tokenJsonRef.where('id', '==', systemId).get();

    if (!existingTokenQuery.empty) {
      // Update the existing document
      const existingDocRef = existingTokenQuery.docs[0].ref;
      console.log('Checking existing token docs for systemId:', systemId);

      await existingDocRef.update({
        tokenData,
        updatedAt: new Date().toISOString()
      });

      console.log('Token JSON updated');
      return res.status(200).json({ message: 'Token JSON updated', success: true });

    } else {
      //  Add a new document
      await tokenJsonRef.add({
        id: systemId,
        username,
        tokenData,
        createdAt: new Date().toISOString()
      });

      console.log('Token JSON data stored');
      return res.status(200).json({ message: 'Token JSON data stored', success: true });
    }
  } catch (err) {
    console.error('Error saving token JSON data:', err);
    return res.status(500).json({ message: 'Issue with saving token JSON data', success: false });
  }
});


app.post('/deleteTokenJson', async (req, res)=>{
    
  const { username, systemId } = req.body;

    console.log('deleteTokenJson Username:', username)
    console.log('deleteTokenJson systemId:', systemId)


  try{
    
    const userRef = await firestore.collection('users').where('username', '==', username).get();

    if(userRef.empty){
      return res.status(401).json({message: 'could not find an account associated with that username', success: false})
    }

    const userDoc = userRef.docs[0].ref;

    const systemToDelete = await userDoc.collection('tokenJson').where('id', '==', systemId).get();

     if (systemToDelete.empty) {
      return res.status(404).json({ message: 'No matching system found to delete', success: false });
    }
     
    const deletePromises = systemToDelete.docs.map((doc) => doc.ref.delete()); // loops through the one index match array
    await Promise.all(deletePromises); // waits for every promise to finish (even tho there is only one)

    return res.status(200).json({ message: 'Token system deleted successfully', success: true });
    
  
  }catch(err){
     console.error('Error saving token JSON data:', err);
    return res.status(500).json({ message: 'Issue with deleting token JSON data', success: false });
    
  }

})


// -------------------------------------------------------------< Packages >---------------------------------------------------------------


   // remember, the user will specify which topic they want from the front end
   // here, is where that will be selected here and sent back accordingly

   // -------------------< Color gradients >------------------

   
   const gradients = [
    {
      name: 'Bloody Sunset',
      colors: ['#ff512f', '#dd2476'],
      description: 'Bloody Sunset brings intense passion and drive, fueling ambitious financial goals.',
      primary: '#ff512f',
      primaryLight: '#FF6D54',
      primaryDark: '#CC4125',
      secondary: '#dd2476',
      secondaryLight: '#E95699',
      secondaryDark: '#AA1C5B'
    },
    {
      name: 'Pink Sunrise',
      colors: ['#f953c6', '#b91d73'],
      description: 'Pink Sunrise ignites passion and confidence for a bright financial dawn.',
      primary: '#f953c6',
      primaryLight: '#F96CD6',
      primaryDark: '#B93694',
      secondary: '#b91d73',
      secondaryLight: '#D2449E',
      secondaryDark: '#8A1657'
    },
    {
      name: 'Peachy',
      colors: ['#ed4264', '#ffedbc'],
      description: 'Peachy blends warmth and softness, inspiring approachable financial optimism.',
      primary: '#ed4264',
      primaryLight: '#F06A80',
      primaryDark: '#B2344C',
      secondary: '#ffedbc',
      secondaryLight: '#FFF3D1',
      secondaryDark: '#CCB77F'
    },
    {
      name: 'Candy',
      colors: ['#ff6a00', '#ee0979'],
      description: 'Candy energizes with vibrant passion and excitement for financial adventure.',
      primary: '#ff6a00',
      primaryLight: '#FF8741',
      primaryDark: '#CC5600',
      secondary: '#ee0979',
      secondaryLight: '#F04B9B',
      secondaryDark: '#B00662'
    },
    {
      name: 'Flamingo',
      colors: ['#fe8c00', '#f83600'],
      description: 'Flamingo bursts with energetic vibrance and bold ambition, symbolizing fearless financial moves and creative growth.',
      primary: '#fe8c00',
      primaryLight: '#FF9F33',
      primaryDark: '#CB7000',
      secondary: '#f83600',
      secondaryLight: '#FF5C33',
      secondaryDark: '#C42A00'
    },
    {
      name: 'Warm Sun',
      colors: ['#f46b45', '#eea849'],
      description: 'Warm Sun radiates positivity and wealth, perfect for financial optimism.',
      primary: '#f46b45',
      primaryLight: '#F9825F',
      primaryDark: '#B75133',
      secondary: '#eea849',
      secondaryLight: '#FBC369',
      secondaryDark: '#B7853A'
    },
    {
      name: 'Sunset',
      colors: ['#FF5F6D', '#FFC371'],
      description: 'Sunset captures the warm energy of a financial sunrise, symbolizing optimism and growth.',
      primary: '#FF5F6D',
      primaryLight: '#FF7F8A',
      primaryDark: '#CC4B54',
      secondary: '#FFC371',
      secondaryLight: '#FFD788',
      secondaryDark: '#CC9F5B'
    },
    {
      name: 'Morning',
      colors: ['#ff5f6d', '#ffc371'],
      description: 'Morning symbolizes fresh starts and growth, perfect for new financial beginnings.',
      primary: '#ff5f6d',
      primaryLight: '#FF7D83',
      primaryDark: '#CC4B56',
      secondary: '#ffc371',
      secondaryLight: '#FFDD90',
      secondaryDark: '#CC9F58'
    },
    {
      name: 'Flare',
      colors: ['#f12711', '#f5af19'],
      description: 'Flare ignites energy and optimism, perfect for bold financial moves.',
      primary: '#f12711',
      primaryLight: '#F3462A',
      primaryDark: '#B3170C',
      secondary: '#f5af19',
      secondaryLight: '#F7C545',
      secondaryDark: '#B88A12'
    },
    {
      name: 'Mango',
      colors: ['#ffe259', '#ffa751'],
      description: 'Mango radiates warmth and abundance, ideal for optimistic financial outlooks.',
      primary: '#ffe259',
      primaryLight: '#FFEF7E',
      primaryDark: '#CCB84A',
      secondary: '#ffa751',
      secondaryLight: '#FFB577',
      secondaryDark: '#B37442'
    },
    {
      name: 'Sunny Days',
      colors: ['#f7971e', '#ffd200'],
      description: 'Sunny Days brings energy and optimism, brightening financial futures.',
      primary: '#f7971e',
      primaryLight: '#FBB93E',
      primaryDark: '#B86F16',
      secondary: '#ffd200',
      secondaryLight: '#FFEB55',
      secondaryDark: '#BBA000'
    },
  
    // 🟢 GREENS
    {
      name: 'Lush Green',
      colors: ['#56ab2f', '#a8e063'],
      description: 'Lush Green embodies growth and renewal, symbolizing prosperous financial health.',
      primary: '#56ab2f',
      primaryLight: '#7AC758',
      primaryDark: '#418224',
      secondary: '#a8e063',
      secondaryLight: '#C9F186',
      secondaryDark: '#7DB44A'
    },
    {
      name: 'Mint Fresh',
      colors: ['#00b09b', '#96c93d'],
      description: 'Mint Fresh refreshes financial perspectives with growth and vitality.',
      primary: '#00b09b',
      primaryLight: '#33C1AA',
      primaryDark: '#008377',
      secondary: '#96c93d',
      secondaryLight: '#B6D46B',
      secondaryDark: '#728A2D'
    },
    {
      name: 'Emerald Water',
      colors: ['#348f50', '#56b4d3'],
      description: 'Emerald Water combines the stability of blue with the growth symbolism of green, making it perfect for representing prosperity and security in finance.',
      primary: '#458B92',
      primaryLight: '#74BCD9',
      primaryDark: '#2A6D48',
      secondary: '#469E7F',
      secondaryLight: '#7CC6B4',
      secondaryDark: '#2A6C50'
    },
  
    // 🔵 BLUES
    {
      name: 'Ocean Blues',
      colors: ['#36D1DC', '#5B86E5'],
      description: 'Ocean Blues combines clarity and depth, perfect for conveying trust and stability in finance.',
      primary: '#36D1DC',
      primaryLight: '#64E6F1',
      primaryDark: '#2AA2B1',
      secondary: '#5B86E5',
      secondaryLight: '#809EF7',
      secondaryDark: '#4665B6'
    },
    {
      name: 'Calm Waters',
      colors: ['#89f7fe', '#66a6ff'],
      description: 'Calm Waters soothes financial anxiety with trust and clarity.',
      primary: '#89f7fe',
      primaryLight: '#A7FAFF',
      primaryDark: '#5EC9D1',
      secondary: '#66a6ff',
      secondaryLight: '#8AADFF',
      secondaryDark: '#446CCC'
    },
    {
      name: 'Sky Blue',
      colors: ['#00c6ff', '#0072ff'],
      description: 'Sky Blue reflects clarity and trust, essential for transparent financial growth.',
      primary: '#00c6ff',
      primaryLight: '#33D4FF',
      primaryDark: '#009ACC',
      secondary: '#0072ff',
      secondaryLight: '#3391FF',
      secondaryDark: '#005BCC'
    },
    {
      name: 'Cool Breeze',
      colors: ['#00c6ff', '#0072ff'],
      description: 'Cool Breeze refreshes the financial landscape with calm confidence.',
      primary: '#00c6ff',
      primaryLight: '#33D2FF',
      primaryDark: '#0096CC',
      secondary: '#0072ff',
      secondaryLight: '#3293FF',
      secondaryDark: '#0059B3'
    },
    {
      name: 'Blue Lagoon',
      colors: ['#43cea2', '#185a9d'],
      description: 'Blue Lagoon balances refreshing growth with deep trust in financial planning.',
      primary: '#43cea2',
      primaryLight: '#6CE2BD',
      primaryDark: '#349373',
      secondary: '#185a9d',
      secondaryLight: '#3A7FC5',
      secondaryDark: '#134471'
    },
    {
      name: 'Steel Blue',
      colors: ['#2980b9', '#6dd5fa', '#ffffff'],
      description: 'Steel Blue stands for strength and clarity, essential in financial stability.',
      primary: '#2980b9',
      primaryLight: '#57A3D9',
      primaryDark: '#1F5E88',
      secondary: '#6dd5fa',
      secondaryLight: '#9BE0FF',
      secondaryDark: '#4AB2D1'
    },
    {
      name: 'Skyline',
      colors: ['#1488cc', '#2b32b2'],
      description: 'Skyline reflects structure and ambition, reaching new financial heights.',
      primary: '#1488cc',
      primaryLight: '#4799E6',
      primaryDark: '#0F6BA1',
      secondary: '#2b32b2',
      secondaryLight: '#5359CF',
      secondaryDark: '#1F2491'
    },
  
    // 🟣 PURPLES / VIOLETS
    {
      name: 'Purple Haze',
      colors: ['#9D50BB', '#6E48AA'],
      description: 'Purple Haze blends creativity with wisdom, inspiring confident financial decisions.',
      primary: '#9D50BB',
      primaryLight: '#B470D0',
      primaryDark: '#7A3A95',
      secondary: '#6E48AA',
      secondaryLight: '#8A6DBC',
      secondaryDark: '#55378A'
    },
    {
      name: 'Purple Dream',
      colors: ['#bc4e9c', '#f80759'],
      description: 'Purple Dream inspires visionary financial growth with passion and creativity.',
      primary: '#bc4e9c',
      primaryLight: '#CF72B4',
      primaryDark: '#8E3B75',
      secondary: '#f80759',
      secondaryLight: '#FA3C7A',
      secondaryDark: '#B30544'
    },
    {
      name: 'Electric Violet',
      colors: ['#3a1c71', '#d76d77', '#ffaf7b'],
      description: 'Electric Violet sparks creativity and passion for dynamic financial growth.',
      primary: '#3a1c71',
      primaryLight: '#574196',
      primaryDark: '#2D165B',
      secondary: '#d76d77',
      secondaryLight: '#E38B8F',
      secondaryDark: '#A35158'
    },
    {
      name: 'Pastel Blue',
      colors: ['#7f7fd5', '#86a8e7', '#91eae4'],
      description: 'Pastel Blue promotes calmness and thoughtful growth in financial decisions.',
      primary: '#7f7fd5',
      primaryLight: '#9CA0E8',
      primaryDark: '#6466B6',
      secondary: '#86a8e7',
      secondaryLight: '#A3C1F0',
      secondaryDark: '#5D79BD'
    },
    {
      name: 'Royal Blue',
      colors: ['#536976', '#292e49'],
      description: 'Royal Blue exudes sophistication and strength, ideal for portraying trust, intelligence, and financial authority.',
      primary: '#536976',
      primaryLight: '#708796',
      primaryDark: '#3F505D',
      secondary: '#292e49',
      secondaryLight: '#464A67',
      secondaryDark: '#1C2035'
    },
  
    // ⚫ NEUTRALS / DARKS
    {
      name: 'Deep Space',
      colors: ['#434343', '#000000'],
      description: 'Deep Space represents stability and strength, foundational to financial security.',
      primary: '#434343',
      primaryLight: '#666666',
      primaryDark: '#2B2B2B',
      secondary: '#000000',
      secondaryLight: '#262626',
      secondaryDark: '#000000'
    },
    {
      name: 'Berry Delight',
      colors: ['#c31432', '#240b36'],
      description: 'Berry Delight combines richness and mystery for confident financial boldness.',
      primary: '#c31432',
      primaryLight: '#D9435D',
      primaryDark: '#970026',
      secondary: '#240b36',
      secondaryLight: '#4D3B62',
      secondaryDark: '#190829'
    },
    {
      name: 'Seashore',
      colors: ['#43c6ac', '#191654'],
      description: 'Seashore evokes tranquility and depth, grounding financial decisions with calm confidence.',
      primary: '#43c6ac',
      primaryLight: '#68D2BC',
      primaryDark: '#36927D',
      secondary: '#191654',
      secondaryLight: '#403F81',
      secondaryDark: '#121040'
    },
    {
      name: 'Frost',
      colors: ['#000428', '#004e92'],
      description: 'Frost cools tensions, providing steady and reliable financial confidence.',
      primary: '#000428',
      primaryLight: '#202049',
      primaryDark: '#00031D',
      secondary: '#004e92',
      secondaryLight: '#2B75C4',
      secondaryDark: '#003E6F'
    }
  ];

      const categorizedGradients = {
          finance: [
            {
              name: "Steel Blue",
              colors: ["#2980b9", "#6dd5fa"],
              primary: "#4C98D5",
              primaryLight: "#91C7EB",
              primaryDark: "#255E88",
              secondary: "#5998C2",
              secondaryLight: "#A0C4DF",
              secondaryDark: "#22587C",
              description: "Steel Blue evokes a sense of trust and reliability, crucial for financial communications. The cool tones are professional and calming, ideal for fostering confidence."
            },
            {
              name: "Emerald Water",
              colors: ["#348f50", "#56b4d3"],
              primary: "#458B92",
              primaryLight: "#74BCD9",
              primaryDark: "#2A6D48",
              secondary: "#469E7F",
              secondaryLight: "#7CC6B4",
              secondaryDark: "#2A6C50",
              description: "Emerald Water combines the stability of blue with the growth symbolism of green, making it perfect for representing prosperity and security in finance."
            },
            {
              name: "Mint Fresh",
              colors: ["#00b09b", "#96c93d"],
              primary: "#1DC689",
              primaryLight: "#7AE3A9",
              primaryDark: "#0E6B4A",
              secondary: "#42D782",
              secondaryLight: "#88E3B6",
              secondaryDark: "#0D5B4A",
              description: "Mint Fresh is invigorating and refreshing, symbolizing financial growth and new opportunities. The green hues convey stability and the promise of a prosperous future."
            },
            {
              name: "Lush Green",
              colors: ["#56ab2f", "#a8e063"],
              primary: "#77BA61",
              primaryLight: "#A7D598",
              primaryDark: "#467042",
              secondary: "#88CA67",
              secondaryLight: "#AFDA8B",
              secondaryDark: "#3F5B4A",
              description: "Lush Green signifies growth, harmony, and fresh starts. It is perfect for finance-related themes as it inspires confidence in fiscal health and stability."
            },
            {
              name: "Mango",
              colors: ["#ffe259", "#ffa751"],
              primary: "#FFC163",
              primaryLight: "#FFDDA4",
              primaryDark: "#F59850",
              secondary: "#FFC46C",
              secondaryLight: "#FFE0AC",
              secondaryDark: "#F5964B",
              description: "Mango is warm and inviting, evoking feelings of optimism and clarity. These attributes are beneficial in finance to convey transparency and positive financial outcomes."
            }
          ],
          entertainment: [
              {
                name: "Electric Violet",
                colors: ["#3a1c71", "#d76d77", "#ffaf7b"],
                primary: "#864081",
                primaryLight: "#D89EAA",
                primaryDark: "#3F1457",
                secondary: "#A35797",
                secondaryLight: "#DBB5C5",
                secondaryDark: "#3F294E",
                description: "Electric Violet creates a vibrant and dynamic atmosphere, perfect for entertainment. The bold, contrasting colors capture attention and convey excitement."
              },
              {
                name: "Purple Dream",
                colors: ["#bc4e9c", "#f80759"],
                primary: "#CD3F85",
                primaryLight: "#E482A9",
                primaryDark: "#913168",
                secondary: "#D15992",
                secondaryLight: "#EBA0C0",
                secondaryDark: "#803057",
                description: "Purple Dream offers a whimsical and fantastical feel, making it ideal for entertainment themes. The vivid hues evoke creativity and a sense of wonder."
              },
              {
                name: "Flamingo",
                colors: ["#fe8c00", "#f83600"],
                primary: "#F75212",
                primaryLight: "#FAA683",
                primaryDark: "#B8350B",
                secondary: "#FA5936",
                secondaryLight: "#FC997D",
                secondaryDark: "#B8480A",
                description: "Flamingo's warm, fiery tones generate a lively and energetic vibe, essential for entertainment. The gradient brings a sense of enthusiasm and action."
              },
              {
                name: "Berry Delight",
                colors: ["#c31432", "#240b36"],
                primary: "#B71E27",
                primaryLight: "#D6646F",
                primaryDark: "#6F0A11",
                secondary: "#B72327",
                secondaryLight: "#D97881",
                secondaryDark: "#58090E",
                description: "Berry Delight combines deep and rich colors to create a luxurious and sophisticated feel, perfect for entertainment. It captures attention and adds depth."
              },
              {
                name: "Peachy",
                colors: ["#ed4264", "#ffedbc"],
                primary: "#F76B9B",
                primaryLight: "#FCB1CE",
                primaryDark: "#A5313E",
                secondary: "#F880A9",
                secondaryLight: "#FDC4D5",
                secondaryDark: "#A13E3D",
                description: "Peachy provides a soft yet vibrant look, great for entertainment. The combination of warm and light colors creates a friendly and welcoming atmosphere."
              }
            ],
          
          health : [
              {
                name: "Lush Green",
                colors: ["#56ab2f", "#a8e063"],
                primary: "#77BA61",
                primaryLight: "#A7D598",
                primaryDark: "#467042",
                secondary: "#88CA67",
                secondaryLight: "#AFDA8B",
                secondaryDark: "#3F5B4A",
                description: "Lush Green conveys freshness, vitality, and health. The green hues are associated with nature and wellness, making it ideal for health-related themes."
              },
              {
                name: "Mint Fresh",
                colors: ["#00b09b", "#96c93d"],
                primary: "#1DC689",
                primaryLight: "#7AE3A9",
                primaryDark: "#0E6B4A",
                secondary: "#42D782",
                secondaryLight: "#88E3B6",
                secondaryDark: "#0D5B4A",
                description: "Mint Fresh is invigorating and refreshing, symbolizing rejuvenation and health. The cool, green tones are calming and promote a sense of wellbeing."
              },
              {
                name: "Cool Breeze",
                colors: ["#00c6ff", "#0072ff"],
                primary: "#1BAFFF",
                primaryLight: "#6BCFFF",
                primaryDark: "#1374B3",
                secondary: "#29B7FF",
                secondaryLight: "#88D7FF",
                secondaryDark: "#12689B",
                description: "Cool Breeze evokes a sense of cleanliness and clarity, essential for health themes. The cool blue tones are soothing and suggest a refreshing environment."
              },
              {
                name: "Sunny Days",
                colors: ["#f7971e", "#ffd200"],
                primary: "#F9AE40",
                primaryLight: "#FCD67B",
                primaryDark: "#C97C18",
                secondary: "#FAB84D",
                secondaryLight: "#FDDC89",
                secondaryDark: "#C78116",
                description: "Sunny Days brings warmth and positivity, which is great for health. The bright yellow and orange tones evoke energy, happiness, and a zest for life."
              },
              {
                name: "Emerald Water",
                colors: ["#348f50", "#56b4d3"],
                primary: "#458B92",
                primaryLight: "#74BCD9",
                primaryDark: "#2A6D48",
                secondary: "#469E7F",
                secondaryLight: "#7CC6B4",
                secondaryDark: "#2A6C50",
                description: "Emerald Water combines the serenity of blue with the growth symbolism of green, making it perfect for health themes focused on healing and rejuvenation."
              }
            ],
            
         food : [
              {
                name: "Mango",
                colors: ["#ffe259", "#ffa751"],
                primary: "#FFC163",
                primaryLight: "#FFDDA4",
                primaryDark: "#F59850",
                secondary: "#FFC46C",
                secondaryLight: "#FFE0AC",
                secondaryDark: "#F5964B",
                description: "Mango combines warm yellows and oranges that are reminiscent of ripe, juicy fruits. These colors evoke a sense of freshness and natural sweetness, perfect for food-related themes."
              },
              {
                name: "Warm Sun",
                colors: ["#f46b45", "#eea849"],
                primary: "#F78950",
                primaryLight: "#FAB882",
                primaryDark: "#B55432",
                secondary: "#F88F5C",
                secondaryLight: "#FCB58F",
                secondaryDark: "#B54E31",
                description: "Warm Sun brings vibrant, sunny hues that evoke warmth and appetite. The gradient suggests comfort and delight, making it ideal for themes related to food and dining."
              },
              {
                name: "Berry Delight",
                colors: ["#c31432", "#240b36"],
                primary: "#B71E27",
                primaryLight: "#D6646F",
                primaryDark: "#6F0A11",
                secondary: "#B72327",
                secondaryLight: "#D97881",
                secondaryDark: "#58090E",
                description: "Berry Delight uses deep red tones that are commonly associated with delicious berries. The rich, enticing colors make it perfect for highlighting food's natural appeal."
              },
              {
                name: "Candy",
                colors: ["#ff6a00", "#ee0979"],
                primary: "#FF9341",
                primaryLight: "#FFAF88",
                primaryDark: "#B7541F",
                secondary: "#F96464",
                secondaryLight: "#FB9E9E",
                secondaryDark: "#AD0E54",
                description: "Candy blends vibrant orange and pink shades, reminiscent of sweet treats and confectionery. The playful and energetic colors are great for fun, food-centric themes."
              },
              {
                name: "Peachy",
                colors: ["#ed4264", "#ffedbc"],
                primary: "#F76B9B",
                primaryLight: "#FCB1CE",
                primaryDark: "#A5313E",
                secondary: "#F880A9",
                secondaryLight: "#FDC4D5",
                secondaryDark: "#A13E3D",
                description: "Peachy features soft and inviting hues, resembling ripe peaches and cream. This gradient creates a sense of comfort and indulgence, perfect for food-related visuals."
              }
            ],
            
          tech : [
              {
                name: "Night Sky",
                colors: ["#000428", "#004e92"],
                primary: "#002B5A",
                primaryLight: "#004C89",
                primaryDark: "#001728",
                secondary: "#003A7A",
                secondaryLight: "#00588E",
                secondaryDark: "#002247",
                description: "Night Sky combines deep, dark blues that evoke a sense of sophistication and technological depth. These colors are perfect for tech themes that require a sleek, modern look."
              },
              {
                name: "Deep Space",
                colors: ["#434343", "#000000"],
                primary: "#2C2C2C",
                primaryLight: "#545454",
                primaryDark: "#1B1B1B",
                secondary: "#363636",
                secondaryLight: "#606060",
                secondaryDark: "#1F1F1F",
                description: "Deep Space uses shades of grey and black to create a mysterious and futuristic atmosphere, ideal for tech designs. These tones convey a sense of cutting-edge innovation."
              },
              {
                name: "Royal Blue",
                colors: ["#536976", "#292e49"],
                primary: "#4A6471",
                primaryLight: "#758A95",
                primaryDark: "#27363F",
                secondary: "#414E5A",
                secondaryLight: "#6C727E",
                secondaryDark: "#202933",
                description: "Royal Blue offers a refined and trustworthy look with its cool blue hues. These colors are great for tech projects that need to establish credibility and reliability."
              },
              {
                name: "Ocean Blues",
                colors: ["#36D1DC", "#5B86E5"],
                primary: "#3BCEDA",
                primaryLight: "#74DDF0",
                primaryDark: "#2A8999",
                secondary: "#4DA2C1",
                secondaryLight: "#83CCE6",
                secondaryDark: "#356F8A",
                description: "Ocean Blues provides a fresh and vibrant look, making it suitable for tech themes focused on innovation and clarity. The gradient symbolizes progress and fluidity."
              },
              {
                name: "Skyline",
                colors: ["#1488cc", "#2b32b2"],
                primary: "#2B8CC2",
                primaryLight: "#6BAAD6",
                primaryDark: "#1E5785",
                secondary: "#3C90D0",
                secondaryLight: "#7EB4E1",
                secondaryDark: "#234976",
                description: "Skyline blends shades of blue to create a modern and dynamic feel, perfect for tech. The gradient suggests connectivity and the boundless potential of technology."
              }
            ],
            
          sport : [
              {
                name: "Steel Blue",
                colors: ["#2980b9", "#6dd5fa"],
                primary: "#4C98D5",
                primaryLight: "#91C7EB",
                primaryDark: "#255E88",
                secondary: "#5998C2",
                secondaryLight: "#A0C4DF",
                secondaryDark: "#22587C",
                description: "Steel Blue exudes strength and dependability, essential qualities in sports. The cool tones are energetic and invigorating, promoting a sense of vigor and endurance."
              },
              {
                name: "Sunny Days",
                colors: ["#f7971e", "#ffd200"],
                primary: "#F9AE40",
                primaryLight: "#FCD67B",
                primaryDark: "#C97C18",
                secondary: "#FAB84D",
                secondaryLight: "#FDDC89",
                secondaryDark: "#C78116",
                description: "Sunny Days brings bright and cheerful colors that radiate energy and positivity. This gradient is perfect for sports as it captures the dynamism and excitement of athletic activities."
              },
              {
                name: "Flare",
                colors: ["#f12711", "#f5af19"],
                primary: "#F26326",
                primaryLight: "#F7A668",
                primaryDark: "#B92D11",
                secondary: "#F36B35",
                secondaryLight: "#F7B384",
                secondaryDark: "#B93715",
                description: "Flare uses intense, fiery colors that symbolize passion and intensity. It's ideal for sports themes as it conveys the competitive spirit and adrenaline rush of sports."
              },
              {
                name: "Cool Breeze",
                colors: ["#00c6ff", "#0072ff"],
                primary: "#1BAFFF",
                primaryLight: "#6BCFFF",
                primaryDark: "#1374B3",
                secondary: "#29B7FF",
                secondaryLight: "#88D7FF",
                secondaryDark: "#12689B",
                description: "Cool Breeze combines refreshing blue tones that bring a sense of clarity and focus. It's great for sports as it represents the cool composure and strategic thinking needed in athletics."
              },
              {
                name: "Ocean Blues",
                colors: ["#36D1DC", "#5B86E5"],
                primary: "#3BCEDA",
                primaryLight: "#74DDF0",
                primaryDark: "#2A8999",
                secondary: "#4DA2C1",
                secondaryLight: "#83CCE6",
                secondaryDark: "#356F8A",
                description: "Ocean Blues offers a clean and invigorating feel, ideal for sports themes. The gradient symbolizes the strength and endurance of athletes, mirroring the vast and powerful ocean."
              }
            ],
            
           travel : [
              {
                name: "Ocean Blues",
                colors: ["#36D1DC", "#5B86E5"],
                primary: "#3BCEDA",
                primaryLight: "#74DDF0",
                primaryDark: "#2A8999",
                secondary: "#4DA2C1",
                secondaryLight: "#83CCE6",
                secondaryDark: "#356F8A",
                description: "Ocean Blues evokes the vastness and serenity of the sea, perfect for travel themes that promote relaxation and adventure. The blue tones suggest clarity and depth, ideal for capturing the essence of travel."
              },
              {
                name: "Sunset",
                colors: ["#FF5F6D", "#FFC371"],
                primary: "#FF8C8F",
                primaryLight: "#FFB1B4",
                primaryDark: "#C74A51",
                secondary: "#FF9B7A",
                secondaryLight: "#FFBB9E",
                secondaryDark: "#C7644A",
                description: "Sunset captures the breathtaking beauty of a sunset, symbolizing the end of a day and the promise of a new adventure. The warm hues are inviting and inspire a sense of wanderlust and exploration."
              },
              {
                name: "Seashore",
                colors: ["#43c6ac", "#191654"],
                primary: "#5AADA0",
                primaryLight: "#91D5CD",
                primaryDark: "#2E746E",
                secondary: "#3A2D6C",
                secondaryLight: "#7A6F9D",
                secondaryDark: "#291D49",
                description: "Seashore blends refreshing greens and deep blues, reminiscent of coastal landscapes. This gradient is perfect for travel themes that highlight natural beauty and tranquility."
              },
              {
                name: "Sky Blue",
                colors: ["#00c6ff", "#0072ff"],
                primary: "#1BAFFF",
                primaryLight: "#6BCFFF",
                primaryDark: "#1374B3",
                secondary: "#29B7FF",
                secondaryLight: "#88D7FF",
                secondaryDark: "#12689B",
                description: "Sky Blue reflects the expansive and limitless sky, ideal for travel themes. The cool blue tones are calming and inspire thoughts of flying and reaching new heights."
              },
              {
                name: "Blue Lagoon",
                colors: ["#43cea2", "#185a9d"],
                primary: "#5ABA8E",
                primaryLight: "#8FD6B8",
                primaryDark: "#28686C",
                secondary: "#3376A2",
                secondaryLight: "#72A4C8",
                secondaryDark: "#255470",
                description: "Blue Lagoon combines shades of green and blue, reminiscent of tranquil waters and lush surroundings. This gradient is perfect for promoting serene and rejuvenating travel experiences."
              }
            ],
            
           music : [
              {
                name: "Purple Haze",
                colors: ["#9D50BB", "#6E48AA"],
                primary: "#A060C3",
                primaryLight: "#BB8ADB",
                primaryDark: "#783684",
                secondary: "#7C5AAD",
                secondaryLight: "#9E83CD",
                secondaryDark: "#593779",
                description: "Purple Haze creates a mysterious and vibrant ambiance, perfect for music themes. The rich purples are often associated with creativity and artistry, making it ideal for musical content."
              },
              {
                name: "Electric Violet",
                colors: ["#3a1c71", "#d76d77", "#ffaf7b"],
                primary: "#864081",
                primaryLight: "#D89EAA",
                primaryDark: "#3F1457",
                secondary: "#A35797",
                secondaryLight: "#DBB5C5",
                secondaryDark: "#3F294E",
                description: "Electric Violet offers a dynamic and energetic vibe, essential for music themes. The bold, contrasting colors capture attention and convey a sense of excitement and movement."
              },
              {
                name: "Candy",
                colors: ["#ff6a00", "#ee0979"],
                primary: "#FF9341",
                primaryLight: "#FFAF88",
                primaryDark: "#B7541F",
                secondary: "#F96464",
                secondaryLight: "#FB9E9E",
                secondaryDark: "#AD0E54",
                description: "Candy blends vibrant orange and pink shades, reminiscent of sweet treats and playful rhythms. These colors bring a fun and lively feel to any musical theme."
              },
              {
                name: "Purple Dream",
                colors: ["#bc4e9c", "#f80759"],
                primary: "#CD3F85",
                primaryLight: "#E482A9",
                primaryDark: "#913168",
                secondary: "#D15992",
                secondaryLight: "#EBA0C0",
                secondaryDark: "#803057",
                description: "Purple Dream offers a whimsical and fantastical feel, ideal for creative and artistic music themes. The vivid hues evoke a sense of imagination and inspiration."
              },
              {
                name: "Pink Sunrise",
                colors: ["#f953c6", "#b91d73"],
                primary: "#F964A6",
                primaryLight: "#FBA7C7",
                primaryDark: "#C2307C",
                secondary: "#BE1D73",
                secondaryLight: "#E172A9",
                secondaryDark: "#8C1850",
                description: "Pink Sunrise combines warm and vibrant tones, perfect for music themes that evoke passion and energy. The gradient symbolizes the dawn of new ideas and creative expression."
              }
            ],
            
        education : [
              {
                name: "Sky Blue",
                colors: ["#00c6ff", "#0072ff"],
                primary: "#1BAFFF",
                primaryLight: "#6BCFFF",
                primaryDark: "#1374B3",
                secondary: "#29B7FF",
                secondaryLight: "#88D7FF",
                secondaryDark: "#12689B",
                description: "Sky Blue reflects clarity and openness, which are ideal for learning environments. The cool tones are calming and can help create a serene and focused atmosphere for education."
              },
              {
                name: "Pastel Blue",
                colors: ["#7f7fd5", "#86a8e7", "#91eae4"],
                primary: "#9188D1",
                primaryLight: "#ABA0E4",
                primaryDark: "#6055A2",
                secondary: "#87A1E2",
                secondaryLight: "#A3B1EE",
                secondaryDark: "#4A6091",
                description: "Pastel Blue offers a soft and inviting palette that promotes a peaceful learning environment. These colors are great for education as they are non-intrusive and help maintain focus."
              },
              {
                name: "Blue Lagoon",
                colors: ["#43cea2", "#185a9d"],
                primary: "#5ABA8E",
                primaryLight: "#8FD6B8",
                primaryDark: "#28686C",
                secondary: "#3376A2",
                secondaryLight: "#72A4C8",
                secondaryDark: "#255470",
                description: "Blue Lagoon combines cool and refreshing tones that evoke a sense of tranquility and depth. This gradient is perfect for educational settings that benefit from a calm and steady atmosphere."
              },
              {
                name: "Calm Waters",
                colors: ["#89f7fe", "#66a6ff"],
                primary: "#8FDFFE",
                primaryLight: "#B3F2FF",
                primaryDark: "#5FA1B3",
                secondary: "#76B6FF",
                secondaryLight: "#A6D1FF", 
                secondaryDark: "#4C75B3",
                description: "Calm Waters brings a soothing combination of blue tones, perfect for reducing stress and anxiety in learning environments. These colors foster a peaceful and productive atmosphere."
              },
              {
                name: "Steel Blue",
                colors: ["#2980b9", "#6dd5fa"],
                primary: "#4C98D5",
                primaryLight: "#91C7EB",
                primaryDark: "#255E88",
                secondary: "#5998C2",
                secondaryLight: "#A0C4DF",
                secondaryDark: "#22587C",
                description: "Steel Blue signifies reliability and intelligence, making it suitable for educational themes. The professional tones are both calming and authoritative, ideal for creating a focused learning space."
              }
            ],
            
      };

       // ------------------< Fonts >-------------------

  const fonts = [
    { name: 'Roboto', category: 'Sans-serif', designer: 'Christian Robertson' },
    { name: 'Open Sans', category: 'Sans-serif', designer: 'Steve Matteson' },
    { name: 'Lato', category: 'Sans-serif', designer: 'Łukasz Dziedzic' },
    { name: 'Montserrat', category: 'Sans-serif', designer: 'Julieta Ulanovsky' },
    { name: 'Oswald', category: 'Sans-serif', designer: 'Vernon Adams' },
    { name: 'Merriweather', category: 'Serif', designer: 'Sorkin Type' },
    { name: 'Playfair Display', category: 'Serif', designer: 'Claus Eggers Sørensen' },
    { name: 'Poppins', category: 'Sans-serif', designer: 'Indian Type Foundry' },
    { name: 'Raleway', category: 'Sans-serif', designer: 'Multiple designers' },
    { name: 'Ubuntu', category: 'Sans-serif', designer: 'Dalton Maag' },
    { name: 'Nunito', category: 'Sans-serif', designer: 'Vernon Adams' },
    { name: 'Titillium Web', category: 'Sans-serif', designer: 'Accademia di Belle Arti di Urbino' },
    { name: 'Work Sans', category: 'Sans-serif', designer: 'Wei Huang' },
    { name: 'Fira Sans', category: 'Sans-serif', designer: 'Mozilla' },
    { name: 'Inconsolata', category: 'Monospace', designer: 'Raph Levien' },
    { name: 'Bebas Neue', category: 'Display', designer: 'Ryoichi Tsunekawa' },
    { name: 'Dancing Script', category: 'Handwriting', designer: 'Impallari Type' },
    { name: 'Raleway', category: 'Sans-serif', designer: 'Matt McInerney' },
    { name: 'PT Sans', category: 'Sans-serif', designer: 'Paratype' },
    { name: 'Bitter', category: 'Serif', designer: 'Sol Matas' },
    { name: 'Cabin', category: 'Sans-serif', designer: 'Pablo Impallari' },
    { name: 'Exo', category: 'Sans-serif', designer: 'Natanael Gama' },
    { name: 'Quicksand', category: 'Sans-serif', designer: 'Andrew Paglinawan' },
    { name: 'Karla', category: 'Sans-serif', designer: 'Jonathan Pinhorn' },
    { name: 'Rubik', category: 'Sans-serif', designer: 'Hubert and Fischer' },
    { name: 'Fjalla One', category: 'Display', designer: 'Sorkin Type' },
    { name: 'Amatic SC', category: 'Handwriting', designer: 'Vernon Adams' },
    { name: 'Space Mono', category: 'Monospace', designer: 'Colophon Foundry' },
    { name: 'Cormorant', category: 'Serif', designer: 'Christian Thalmann' },
    { name: 'Varela Round', category: 'Sans-serif', designer: 'Joe Prince' },
    { name: 'Abril Fatface', category: 'Display', designer: 'Veronika Burian' },
    { name: 'Libre Baskerville', category: 'Serif', designer: 'Pablo Impallari' },
    { name: 'Crimson Text', category: 'Serif', designer: 'Sebastian Kosch' },
    { name: 'Muli', category: 'Sans-serif', designer: 'Vernon Adams' },
    { name: 'Josefin Sans', category: 'Sans-serif', designer: 'Santiago Orozco' },
    { name: 'Asap', category: 'Sans-serif', designer: 'Omnibus-Type' },
    { name: 'Mukta', category: 'Sans-serif', designer: 'EK Type' },
    { name: 'Libre Franklin', category: 'Sans-serif', designer: 'Pablo Impallari' },
    { name: 'Anton', category: 'Display', designer: 'Vernon Adams' },
    { name: 'Signika', category: 'Sans-serif', designer: 'Anna Giedryś' },
    { name: 'Lora', category: 'Serif', designer: 'Cyreal' },
    { name: 'Alegreya', category: 'Serif', designer: 'Juan Pablo del Peral' },
    { name: 'Zilla Slab', category: 'Slab Serif', designer: 'Typotheque' },
    { name: 'Teko', category: 'Sans-serif', designer: 'Indian Type Foundry' },
    { name: 'Archivo', category: 'Sans-serif', designer: 'Omnibus-Type' },
    { name: 'Heebo', category: 'Sans-serif', designer: 'Oded Ezer' },
    { name: 'Catamaran', category: 'Sans-serif', designer: 'Indian Type Foundry' },
    { name: 'Martel', category: 'Serif', designer: 'Indian Type Foundry' },
    { name: 'Noto Sans', category: 'Sans-serif', designer: 'Google' },
    { name: 'Manrope', category: 'Sans-serif', designer: 'Mikhail Sharanda' },
    { name: 'Maven Pro', category: 'Sans-serif', designer: 'Joe Prince' },
    { name: 'Arimo', category: 'Sans-serif', designer: 'Steve Matteson' },
    { name: 'Tangerine', category: 'Handwriting', designer: 'Toshi Omagari' },
    { name: 'Pacifico', category: 'Handwriting', designer: 'Vernon Adams' },
    { name: 'PT Serif', category: 'Serif', designer: 'Paratype' },
    { name: 'Pathway Gothic One', category: 'Sans-serif', designer: 'Eduardo Tunni' },
    { name: 'Patua One', category: 'Display', designer: 'LatinoType' },
    { name: 'Acme', category: 'Display', designer: 'Huerta Tipográfica' },
    { name: 'Kreon', category: 'Serif', designer: 'Julia Petretta' },
    { name: 'Julius Sans One', category: 'Sans-serif', designer: 'Julia Petretta' },
    { name: 'Alfa Slab One', category: 'Display', designer: 'JM Solé' },
    { name: 'Baloo 2', category: 'Display', designer: 'EK Type' },
    { name: 'Vollkorn', category: 'Serif', designer: 'Friedrich Althausen' },
    { name: 'Cardo', category: 'Serif', designer: 'David Perry' },
    { name: 'Noto Serif', category: 'Serif', designer: 'Google' },
    { name: 'Arapey', category: 'Serif', designer: 'Eduardo Tunni' },
    { name: 'Coda', category: 'Display', designer: 'Vernon Adams' },
    { name: 'Encode Sans', category: 'Sans-serif', designer: 'Impallari Type' },
    { name: 'Sintony', category: 'Sans-serif', designer: 'Eduardo Tunni' },
    { name: 'Quattrocento', category: 'Serif', designer: 'Impallari Type' },
    { name: 'Bad Script', category: 'Handwriting', designer: 'Google' },
    { name: 'Andika', category: 'Sans-serif', designer: 'SIL International' },
    { name: 'Glegoo', category: 'Serif', designer: 'Eduardo Tunni' },
    { name: 'Gentium Basic', category: 'Serif', designer: 'SIL International' },
    { name: 'Jura', category: 'Sans-serif', designer: 'Edmund Halle' },
    { name: 'Domine', category: 'Serif', designer: 'Impallari Type' },
    { name: 'KoHo', category: 'Sans-serif', designer: 'Cadson Demak' },
    { name: 'Overpass', category: 'Sans-serif', designer: 'Red Hat' },
    { name: 'Aldrich', category: 'Sans-serif', designer: 'Matthew Desmond' },
    { name: 'Nova Flat', category: 'Display', designer: 'Wojciech Kalinowski' },
    { name: 'Hind', category: 'Sans-serif', designer: 'Indian Type Foundry' },
    { name: 'Alike', category: 'Serif', designer: 'Cyreal' },
    { name: 'Noticia Text', category: 'Serif', designer: 'Omnibus-Type' },
    { name: 'Rosario', category: 'Sans-serif', designer: 'Omnibus-Type' },
    { name: 'Coustard', category: 'Serif', designer: 'Octavio Pardo' },
    { name: 'Artifika', category: 'Serif', designer: 'Cyreal' },
    ];
  
  // this one below
  const fontsByCategory = {
    finance: [
      { 
        name: 'Roboto', 
        category: 'Sans-serif', 
        designer: 'Christian Robertson', 
        uri: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', 
        description: "Roboto is modern and highly readable, making it perfect for financial reports and interfaces."
      },
      { 
        name: 'Montserrat', 
        category: 'Sans-serif', 
        designer: 'Julieta Ulanovsky', 
        uri: 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap', 
        description: "Montserrat's clean lines and versatility make it ideal for professional financial presentations."
      },
      { 
        name: 'Lora', 
        category: 'Serif', 
        designer: 'Cyreal', 
        uri: 'https://fonts.googleapis.com/css2?family=Lora&display=swap', 
        description: "Lora's elegant serif style exudes trust and reliability, perfect for financial documents."
      },
      { 
        name: 'Libre Franklin', 
        category: 'Sans-serif', 
        designer: 'Pablo Impallari', 
        uri: 'https://fonts.googleapis.com/css2?family=Libre+Franklin&display=swap', 
        description: "Libre Franklin offers a clear and authoritative look, suitable for important financial statements."
      },
      { 
        name: 'Source Sans 3', 
        category: 'Sans-serif', 
        designer: 'Paul D. Hunt', 
        uri: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap', 
        description: "Source Sans 3 is professional and easy to read, perfect for financial dashboards and data."
      }
    ],
    entertainment: [
      { 
        name: 'Bebas Neue', 
        category: 'Display', 
        designer: 'Ryoichi Tsunekawa', 
        uri: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap', 
        description: "Bebas Neue's bold and striking appearance makes it great for headlines and posters in entertainment."
      },
      { 
        name: 'Raleway', 
        category: 'Sans-serif', 
        designer: 'Matt McInerney', 
        uri: 'https://fonts.googleapis.com/css2?family=Raleway&display=swap', 
        description: "Raleway's elegant and clean design is ideal for sophisticated entertainment content."
      },
      { 
        name: 'Abril Fatface', 
        category: 'Display', 
        designer: 'Veronika Burian', 
        uri: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap', 
        description: "Abril Fatface's dramatic style is perfect for creating attention-grabbing headlines and titles."
      },
      { 
        name: 'Oswald', 
        category: 'Sans-serif', 
        designer: 'Vernon Adams', 
        uri: 'https://fonts.googleapis.com/css2?family=Oswald&display=swap', 
        description: "Oswald's condensed and stylish appearance works well for modern entertainment designs."
      },
      { 
        name: 'Anton', 
        category: 'Display', 
        designer: 'Vernon Adams', 
        uri: 'https://fonts.googleapis.com/css2?family=Anton&display=swap', 
        description: "Anton is bold and impactful, making it suitable for high-energy entertainment content."
      }
    ],
    tech: [
      { 
        name: 'Roboto', 
        category: 'Sans-serif', 
        designer: 'Christian Robertson', 
        uri: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', 
        description: "Roboto's modern and geometric design is ideal for tech interfaces and websites."
      },
      { 
        name: 'Ubuntu', 
        category: 'Sans-serif', 
        designer: 'Dalton Maag', 
        uri: 'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap', 
        description: "Ubuntu's friendly and humanist style is great for approachable tech branding."
      },
      { 
        name: 'Fira Sans', 
        category: 'Sans-serif', 
        designer: 'Mozilla', 
        uri: 'https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap', 
        description: "Fira Sans is highly legible and versatile, perfect for coding environments and tech blogs."
      },
      { 
        name: 'Work Sans', 
        category: 'Sans-serif', 
        designer: 'Wei Huang', 
        uri: 'https://fonts.googleapis.com/css2?family=Work+Sans&display=swap', 
        description: "Work Sans's clean and modern aesthetic is ideal for tech start-ups and app interfaces."
      },
      { 
        name: 'Exo', 
        category: 'Sans-serif', 
        designer: 'Natanael Gama', 
        uri: 'https://fonts.googleapis.com/css2?family=Exo&display=swap', 
        description: "Exo's futuristic style makes it perfect for cutting-edge tech designs and projects."
      }
    ],
    health: [
      { 
        name: 'Nunito', 
        category: 'Sans-serif', 
        designer: 'Vernon Adams', 
        uri: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap', 
        description: "Nunito's rounded and friendly design promotes a sense of wellbeing and care."
      },
      { 
        name: 'Poppins', 
        category: 'Sans-serif', 
        designer: 'Indian Type Foundry', 
        uri: 'https://fonts.googleapis.com/css2?family=Poppins&display=swap', 
        description: "Poppins's geometric and clean lines are perfect for health websites and applications."
      },
      { 
        name: 'Lato', 
        category: 'Sans-serif', 
        designer: 'Łukasz Dziedzic', 
        uri: 'https://fonts.googleapis.com/css2?family=Lato&display=swap', 
        description: "Lato's warmth and simplicity make it ideal for healthcare communications and branding."
      },
      { 
        name: 'Mulish', 
        category: 'Sans-serif', 
        designer: 'Vernon Adams', 
        uri: 'https://fonts.googleapis.com/css2?family=Muli&display=swap', 
        description: "Mulish's minimalist style is suitable for clean and modern health interfaces."
      },
      { 
        name: 'Quicksand', 
        category: 'Sans-serif', 
        designer: 'Andrew Paglinawan', 
        uri: 'https://fonts.googleapis.com/css2?family=Quicksand&display=swap', 
        description: "Quicksand's soft and approachable appearance is perfect for health-related content."
      }
    ],
    food: [
      { 
        name: 'Dancing Script', 
        category: 'Handwriting', 
        designer: 'Impallari Type', 
        uri: 'https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap', 
        description: "Dancing Script's playful and lively style is great for food blogs and menus."
      },
      { 
        name: 'Pacifico', 
        category: 'Handwriting', 
        designer: 'Vernon Adams', 
        uri: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap', 
        description: "Pacifico's casual and friendly script is ideal for fun and inviting food branding."
      },
      { 
        name: 'Amatic SC', 
        category: 'Handwriting', 
        designer: 'Vernon Adams', 
        uri: 'https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap', 
        description: "Amatic SC's quirky and hand-drawn look is perfect for creative and unique food visuals."
      },
      { 
        name: 'Merriweather', 
        category: 'Serif', 
        designer: 'Sorkin Type', 
        uri: 'https://fonts.googleapis.com/css2?family=Merriweather&display=swap', 
        description: "Merriweather's readability and classic style make it great for food articles and recipes."
      },
      { 
        name: 'Josefin Sans', 
        category: 'Sans-serif', 
        designer: 'Santiago Orozco', 
        uri: 'https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap', 
        description: "Josefin Sans's elegant and vintage feel is perfect for sophisticated food branding."
      }
    ],
    sport: [
        { 
          name: 'Oswald', 
          category: 'Sans-serif', 
          designer: 'Vernon Adams', 
          uri: 'https://fonts.googleapis.com/css2?family=Oswald&display=swap', 
          description: "Oswald's strong and condensed style makes it perfect for bold and impactful sports branding."
        },
        { 
          name: 'Titillium Web', 
          category: 'Sans-serif', 
          designer: 'Accademia di Belle Arti di Urbino', 
          uri: 'https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap', 
          description: "Titillium Web's modern and dynamic design is ideal for energetic and contemporary sports content."
        },
        { 
          name: 'Teko', 
          category: 'Sans-serif', 
          designer: 'Indian Type Foundry', 
          uri: 'https://fonts.googleapis.com/css2?family=Teko&display=swap', 
          description: "Teko's bold and compact appearance is great for high-impact sports visuals and merchandise."
        },
        { 
          name: 'PT Sans', 
          category: 'Sans-serif', 
          designer: 'Paratype', 
          uri: 'https://fonts.googleapis.com/css2?family=PT+Sans&display=swap', 
          description: "PT Sans's clean and professional look is versatile for various sports applications, from websites to print materials."
        },
        { 
          name: 'Anton', 
          category: 'Display', 
          designer: 'Vernon Adams', 
          uri: 'https://fonts.googleapis.com/css2?family=Anton&display=swap', 
          description: "Anton is bold and impactful, making it suitable for high-energy sports content and event branding."
        }
      ],
    travel: [
        { 
          name: 'Cormorant', 
          category: 'Serif', 
          designer: 'Christian Thalmann', 
          uri: 'https://fonts.googleapis.com/css2?family=Cormorant&display=swap', 
          description: "Cormorant's elegant and refined style evokes a sense of luxury and adventure, perfect for travel content."
        },
        { 
          name: 'Libre Baskerville', 
          category: 'Serif', 
          designer: 'Pablo Impallari', 
          uri: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap', 
          description: "Libre Baskerville's classic and sophisticated design is ideal for travel guides and magazines."
        },
        { 
          name: 'Playfair Display', 
          category: 'Serif', 
          designer: 'Claus Eggers Sørensen', 
          uri: 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap', 
          description: "Playfair Display's stylish and high-contrast look is great for capturing the elegance of travel destinations."
        },
        { 
          name: 'Crimson Text', 
          category: 'Serif', 
          designer: 'Sebastian Kosch', 
          uri: 'https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap', 
          description: "Crimson Text's traditional and readable serif is perfect for travel literature and storytelling."
        },
        { 
          name: 'Alfa Slab One', 
          category: 'Display', 
          designer: 'JM Solé', 
          uri: 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap', 
          description: "Alfa Slab One's bold and distinctive slab serif is great for eye-catching travel posters and ads."
        }
      ],
     music: [
        { 
          name: 'Bebas Neue', 
          category: 'Display', 
          designer: 'Ryoichi Tsunekawa', 
          uri: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap', 
          description: "Bebas Neue's bold and striking appearance makes it perfect for music album covers and posters."
        },
        { 
          name: 'Raleway', 
          category: 'Sans-serif', 
          designer: 'Matt McInerney', 
          uri: 'https://fonts.googleapis.com/css2?family=Raleway&display=swap', 
          description: "Raleway's sleek and elegant design is ideal for music event flyers and digital content."
        },
        { 
          name: 'Varela Round', 
          category: 'Sans-serif', 
          designer: 'Joe Prince', 
          uri: 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap', 
          description: "Varela Round's friendly and rounded style is great for approachable and fun music branding."
        },
        { 
          name: 'Abril Fatface', 
          category: 'Display', 
          designer: 'Veronika Burian', 
          uri: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap', 
          description: "Abril Fatface's dramatic and impactful style is perfect for bold music titles and branding."
        },
        { 
          name: 'Lobster', 
          category: 'Handwriting', 
          designer: 'Impallari Type', 
          uri: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap', 
          description: "Lobster's playful and cursive design is ideal for creative and informal music content."
        }
      ],
    education : [
        { 
          name: 'Noto Sans', 
          category: 'Sans-serif', 
          designer: 'Google', 
          uri: 'https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap', 
          description: "Noto Sans is highly legible and versatile, making it perfect for educational content and materials."
        },
        { 
          name: 'Arimo', 
          category: 'Sans-serif', 
          designer: 'Steve Matteson', 
          uri: 'https://fonts.googleapis.com/css2?family=Arimo&display=swap', 
          description: "Arimo's clean and crisp design ensures readability, ideal for textbooks and online learning platforms."
        },
        { 
          name: 'Kreon', 
          category: 'Serif', 
          designer: 'Julia Petretta', 
          uri: 'https://fonts.googleapis.com/css2?family=Kreon&display=swap', 
          description: "Kreon's warm and inviting style is great for engaging and approachable educational content."
        },
        { 
          name: 'Lora', 
          category: 'Serif', 
          designer: 'Cyreal', 
          uri: 'https://fonts.googleapis.com/css2?family=Lora&display=swap', 
          description: "Lora's elegant and classic serif design is perfect for formal educational documents and articles."
        },
        { 
          name: 'Maven Pro', 
          category: 'Sans-serif', 
          designer: 'Joe Prince', 
          uri: 'https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap', 
          description: "Maven Pro's modern and professional appearance is ideal for academic presentations and websites."
        }
      ],
      
  };

    // -------------------< Scales >-----------------

    const typographyScales2 = [ // firebase friendly 
      {
        name: 'Display Heavy',
        styles: [
          { label: 'h1', size: 44, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 34, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 29, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 24, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 20, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 17, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 14, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 11, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale15', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      },
      {
        name: 'Display',
        styles: [
          { label: 'h1', size: 42, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 32, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 27, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 22, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 19, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 16, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 13, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 10, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale14', size: 7, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      },
      {
        name: 'Display Compact',
        styles: [
          { label: 'h1', size: 40, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 30, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 25, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 21, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 18, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 15, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 12, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 9, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale13', size: 6, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      },
      {
        name: 'Readable',
        styles: [
          { label: 'h1', size: 38, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 28, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 24, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 20, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 17, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 14, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 11, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale12', size: 7, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      },
      {
        name: 'Compact',
        styles: [
          { label: 'h1', size: 36, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 26, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 23, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 19, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 16, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 13, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 10, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 9, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale11', size: 6, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      },
      {
        name: 'Minimal',
        styles: [
          { label: 'h1', size: 34, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 24, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 22, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 18, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 15, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 12, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 9, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale10', size: 5, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      },
      {
        name: 'MiExperimental or Glitched',
        styles: [
          { label: 'h1', size: 3, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h2', size: 22, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h3', size: 20, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h4', size: 16, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h5', size: 14, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'h6', size: 11, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'p', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'small', size: 7, example: 'Brown jars prevented the mixture from freezing too quickly' },
          { label: 'scale9', size: 6, example: 'Brown jars prevented the mixture from freezing too quickly' }
        ]
      }
    ];

    const typographyScales = [
      [
        {name: 'Display Heavy'},
        { label: 'h1', size: 44, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 34, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 29, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 24, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 20, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 17, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 14, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 11, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale15', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ],
      [
        {name: 'Display'},
        { label: 'h1', size: 42, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 32, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 27, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 22, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 19, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 16, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 13, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 10, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale14', size: 7, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ],
      [
        {name: 'Display Compact'},
        { label: 'h1', size: 40, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 30, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 25, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 21, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 18, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 15, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 12, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 9, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale13', size: 6, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ],
      [
        {name: 'Readable'},
        { label: 'h1', size: 38, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 28, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 24, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 20, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 17, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 14, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 11, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale12', size: 7, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ],
      [
        {name: 'Compact'},
        { label: 'h1', size: 36, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 26, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 23, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 19, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 16, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 13, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 10, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 9, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale11', size: 6, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ],
      [
        {name: 'Minimal'},
        { label: 'h1', size: 34, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 24, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 22, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 18, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 15, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 12, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 9, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale10', size: 5, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ],
      [
        {name: 'MiExperimental or Glitched'},
        { label: 'h1', size: 3, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h2', size: 22, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h3', size: 20, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h4', size: 16, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h5', size: 14, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'h6', size: 11, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'p', size: 8, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'small', size: 7, example: 'Brown jars prevented the mixture from freezing too quickly' },
        { label: 'scale9', size: 6, example: 'Brown jars prevented the mixture from freezing too quickly' }
      ]
    ];

// --------------------< Components >-------------

const styledComponents = [
  {
    "package": "Package A",
    "components": {
      "button": {
        "styles": {
          "borderWidth": 2,
          "borderColor": "#007bff",
          "borderRadius": 4,
          "shadowColor": "#ffff",
          "shadowOffset": { "width": 0, "height": 2 },
          "shadowOpacity": 0.3,
          "shadowRadius": 5,
          "elevation": 5,
          "margin": 5,
          "paddingVertical": 10,
          "paddingHorizontal": 20
        }
      },
      "card": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#ddd",
          "borderRadius": 8,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 4 },
          "shadowOpacity": 0.1,
          "shadowRadius": 10,
          "elevation": 10,
          "flexDirection": "column",
          "padding": 15
        }
      }
    }
  },
  {
    "package": "Package B",
    "components": {
      "button": {
        "styles": {
          "borderWidth": 0,
          "borderRadius": 6,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 4 },
          "shadowOpacity": 0.1,
          "shadowRadius": 6,
          "elevation": 6,
          "margin": 10,
          "paddingVertical": 12,
          "paddingHorizontal": 24
        }
      },
      "card": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#28a745",
          "borderRadius": 10,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 6 },
          "shadowOpacity": 0.2,
          "shadowRadius": 15,
          "elevation": 15,
          "flexDirection": "column",
          "padding": 20
        }
      }
    }
  },
  {
    "package": "Package C",
    "components": {
      "button": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#dc3545",
          "borderRadius": 3,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 1 },
          "shadowOpacity": 0.2,
          "shadowRadius": 3,
          "elevation": 3,
          "margin": 8,
          "paddingVertical": 8,
          "paddingHorizontal": 18
        }
      },
      "card": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#dc3545",
          "borderRadius": 5,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 3 },
          "shadowOpacity": 0.2,
          "shadowRadius": 6,
          "elevation": 6,
          "flexDirection": "column",
          "padding": 10
        }
      }
    }
  },
  {
    "package": "Package D",
    "components": {
      "button": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#6f42c1",
          "borderRadius": 12,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 3 },
          "shadowOpacity": 0.2,
          "shadowRadius": 8,
          "elevation": 8,
          "margin": 12,
          "paddingVertical": 10,
          "paddingHorizontal": 22
        }
      },
      "card": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#6f42c1",
          "borderRadius": 12,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 4 },
          "shadowOpacity": 0.3,
          "shadowRadius": 12,
          "elevation": 12,
          "flexDirection": "column",
          "padding": 15
        }
      }
    }
  },
  {
  "package": "Package E",
    "components": {
      "button": {
        "styles": {
          "borderWidth": 2,
          "borderColor": "#fd7e14",
          "borderRadius": 5,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 2 },
          "shadowOpacity": 0.2,
          "shadowRadius": 5,
          "elevation": 5,
          "margin": 7,
          "paddingVertical": 9,
          "paddingHorizontal": 19
        }
      },
      "card": {
        "styles": {
          "borderWidth": 1,
          "borderColor": "#fd7e14",
          "borderRadius": 7,
          "shadowColor": "#000",
          "shadowOffset": { "width": 0, "height": 5 },
          "shadowOpacity": 0.2,
          "shadowRadius": 15,
          "elevation": 15,
          "flexDirection": "column",
          "padding": 12
        }
      }
    }
  }
]

const tips = [
  {
    id: 1,
    icon: "accessibility", // MaterialIcons example
    title: "Accessibility Matters",
    tip: "Use sufficient color contrast for text and backgrounds to improve readability for everyone."
  },
  {
    id: 2,
    icon: "touch-app",
    title: "Touch Targets",
    tip: "Make touch targets at least 44x44pt to ensure they’re easy to tap on all devices."
  },
  {
    id: 3,
    icon: "format-size",
    title: "Hierarchy with Size",
    tip: "Use typography size and weight to establish clear hierarchy in your layouts."
  },
  {
    id: 4,
    icon: "palette",
    title: "Limit Color Palette",
    tip: "Stick to 3-5 primary colors to maintain visual consistency across your app."
  },
  {
    id: 5,
    icon: "grid-on",
    title: "Use an 8pt Grid",
    tip: "Align spacing and sizing to an 8pt grid system for a cleaner, more organized UI."
  },
  {
    id: 6,
    icon: "visibility",
    title: "Avoid Placeholder Text",
    tip: "Don't use placeholder text as labels; use persistent labels for clarity."
  },
  {
    id: 7,
    icon: "gesture",
    title: "Feedback on Actions",
    tip: "Provide visual or haptic feedback when users tap buttons to confirm their action."
  },
  {
    id: 8,
    icon: "contrast",
    title: "Dark Mode Testing",
    tip: "Test your designs in both light and dark modes to ensure readability and consistency."
  },
  {
    id: 9,
    icon: "speed",
    title: "Optimize Loading Times",
    tip: "Users expect quick load times; optimize images and lazy load heavy assets when possible."
  },
  {
    id: 10,
    icon: "swipe",
    title: "Avoid Hidden Gestures",
    tip: "Don’t hide critical actions behind gestures alone; provide visible alternatives."
  },
  {
    id: 11,
    icon: "text-fields",
    title: "Readable Line Length",
    tip: "Keep line lengths between 45-75 characters to improve readability."
  },
  {
    id: 12,
    icon: "phonelink",
    title: "Design for All Screen Sizes",
    tip: "Test your UI on multiple devices to ensure layouts adapt gracefully."
  },
  {
    id: 13,
    icon: "done",
    title: "Reduce Cognitive Load",
    tip: "Keep interfaces simple by showing only what users need at each step."
  },
  {
    id: 14,
    icon: "star",
    title: "Consistency Builds Trust",
    tip: "Use consistent colors, icons, and typography to build user familiarity."
  },
  {
    id: 15,
    icon: "help-outline",
    title: "Progress Indicators",
    tip: "Use spinners or skeleton loaders to indicate loading states, reducing uncertainty."
  },
  {
    id: 16,
    icon: "lock",
    title: "Security UX",
    tip: "Inform users clearly when sensitive actions are performed and why authentication is needed."
  },
  {
    id: 17,
    icon: "highlight",
    title: "Whitespace is Powerful",
    tip: "Don’t overcrowd your UI; whitespace helps users focus on what matters."
  },
  {
    id: 18,
    icon: "code",
    title: "Use Semantic Components",
    tip: "Using semantic and meaningful component names helps maintain accessibility and clarity."
  },
  {
    id: 19,
    icon: "error-outline",
    title: "Clear Error States",
    tip: "Explain what went wrong in plain language and how users can fix it."
  },
  {
    id: 20,
    icon: "school",
    title: "Never Stop Learning",
    tip: "Stay updated with evolving design trends and guidelines to improve your design craft."
  }
];


// icons are already impoted on the front end and used with a icon component

app.get('/pickElement', async (req, res) => {
    const {category} = req.query;

    if(category === "fonts"){
      return res.json(fonts)
    }

    else if(category === "gradients" || category === 'color'){
      return res.json(gradients)
    }

    else if(category === 'typography'){
      return res.json(typographyScales2)
    }

    else if(category === 'comp' || category === 'component'){
    
      return res.json(styledComponents)
    } 
    else if(category === 'tips'){
      return res.json(tips);
    }
});


// --------------------------------------------< Topic Screen Pre-Package Category Data >---------------------------------------------------

app.get('/elements', (req, res) => {
  const { type } = req.query;
  let typoIndex = Math.floor(Math.random() * 7); // int between 0 - 6
  let compIndex = Math.floor(Math.random() * 4); // int between  0 - 3

  if (type === 'entertainment') {
    let entertainmentResponseData = {
      gradients: categorizedGradients.entertainment,
      fonts: fontsByCategory.entertainment,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(entertainmentResponseData);

  } else if (type === 'tech') {
    let techResponseData = {
      gradients: categorizedGradients.tech,
      fonts: fontsByCategory.tech,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(techResponseData);

  } else if (type === 'health') {
    let healthResponseData = {
      gradients: categorizedGradients.health,
      fonts: fontsByCategory.health,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(healthResponseData);

  } else if (type === 'food') {
    let foodResponseData = {
      gradients: categorizedGradients.food,
      fonts: fontsByCategory.food,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(foodResponseData);

  } else if (type === 'finance') {
    let financeResponseData = {
      gradients: categorizedGradients.finance,
      fonts: fontsByCategory.finance,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(financeResponseData);

  } else if (type === 'sport') {
    let sportResponseData = {
      gradients: categorizedGradients.sport,
      fonts: fontsByCategory.sport,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(sportResponseData);

  } else if (type === 'travel') {
    let travelResponseData = {
      gradients: categorizedGradients.travel,
      fonts: fontsByCategory.travel,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(travelResponseData);

  } else if (type === 'music') {
    let musicResponseData = {
      gradients: categorizedGradients.music,
      fonts: fontsByCategory.music,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(musicResponseData);

  } else if (type === 'education') {
    let educationResponseData = {
      gradients: categorizedGradients.education,
      fonts: fontsByCategory.education,
      typography: typographyScales2[typoIndex],
      styledComponents: styledComponents[compIndex],
    };
    return res.json(educationResponseData);

  } else {
    return res.status(400).json({ message: 'That type does not exist' });
  }
});

// --------------------------------------------------------< Feeback/Contact Route >-------------------------------------------------------------


app.post('/contact', async (req, res) => {

   const {subject, message, username} = req.body;
   console.log('contact data:', req.body)
 

   try{

     const collection =  firestore.collection('feedback');

      await collection.add({
        subject,
        message,
        username, 
        createdAt: admin.firestore.Timestamp.now(),
      })
      console.log('contact message stored in firebase')
      return res.status(200).json({message: 'message sent, your feedback is appreciated', success: true})



   }catch(err){
    console.log('there was an error saving that message to the database', err)
        return res.status(500).json({message: 'there was an error saving that message to the database', success: false})
   }
  
})




// --------------------------------------------------------< Register Route >-------------------------------------------------------------

app.post('/register', async (req, res) => {

const { username, email, pass} = req.body;

    // access the req.body.username/email
    // make sure the route is working properly with postman by sending test json data to the backend and handle it
try{
  // remember firebase uses snapshots, you can access userrs directly 
   const existingUsername = await firestore.collection('users').where('username', '==', username).get()
   const existingEmail = await firestore.collection('users').where('email', '==', email).get()
  
   // these are snapshots above

if (!existingUsername.empty || !existingEmail.empty) {
  return res.status(409).json({ message: 'There is already an account associated with that username or email' });
}

        const hashedPass = await bcrypt.hash(pass, 10) // (salt rounds) applies the hashing algorithm 10 times

              await firestore.collection('users').add({  
                username,
                pass: hashedPass,
                email
              });

     return res.status(200).json({ message: 'Account successfully created' });
} 
catch(error){
       console.error('Error creating user', error);
       res.status(500).json({ message: 'error creating account' });
    }





    // use mongoose to create the new user in the mongo db
    // send a response object back with the intel that shows the account was either created successfully or not

})

// -------------------------------------------------------< Change Account Route >---------------------------------------------------------


app.post('/changePass', async (req, res) => {
   
  const { username, oldUsername, email, pass} = req.body;
  // console.log(req.body)

  try{

    const existingUser = await firestore.collection('users').where('username', '==', oldUsername).get();

    if(existingUser.empty){
      return res.status(500).json({message: "could not find that user"})
      
    }

    // how do i write code here to update apreexisting password ?
    const userDoc = existingUser.docs[0];
    const hashedPass = await bcrypt.hash(pass, 10);

    await userDoc.ref.update({ pass: hashedPass });

    return res.status(200).json({message: "password successfully changed"})


  }catch(err){
    console.error('Error updating password:', err);
    return res.status(500).json({ message: "Internal server error" });
  }


});

app.post('/changeUsername', async (req, res) => {
   
  const { newUsername, oldUsername, email} = req.body;
  // maybe make it so it uses the users email and sends an automated message to their email to know that its being changed or verify it 
  // do this with password too ?
  console.log(req.body)


  try{

    const snapshot = await firestore.collection('users').where('username', "==", oldUsername).get();

    if(snapshot.empty){
      return res.status(500).json({message: "could not find a user with that username"})
    }

    const existingUsername = await firestore.collection('users').where('username', '==', newUsername).get();
    if (!existingUsername.empty) {
      return res.status(400).json({ message: 'That username is already taken' });
    }
 
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ username: newUsername });

    // update username property in all the design systems 
    
    // get the saved systems collection snapshot
    const systemsSnapshot = await firestore.collection('savedSystems').where('username', '==', oldUsername).get();
    
   // firestore batch lets you update multiple documents at once 
   const batch = firestore.batch(); // initialize it 

      systemsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { username: newUsername }); // use it on the saved systems to update all of them at once 
      });

    await batch.commit();

    // then send success 

    return res.status(200).json({message: 'username successfully changed'})


  }catch(err){
    console.error('Error updating new username', err)
    return res.status(500).json({ message: "Internal server error" });
  }


});


// ------------------------------------------------------------< Login Route >--------------------------------------------------------------


app.post('/login', async (req, res) => {

// now for the login logic we will be sent another body of input log values that we need to unpack
// we then need to compare this req.body input with the mongoose database
// if the username and password match, then the server has successfully found an account on the mongo database
// if not, we need to once again send a response error object back to the front end and display the message to the client
// telling them that their password or username was incorrect

    const { username, pass } = req.body;

    try {
       // this is a snapshot
        const userMatch = await firestore.collection('users').where('username', '==', username).get();
      
        // remember firebase uses snapshots, you can access userrs directly 

        if (userMatch.empty) {
            return res.status(400).json({ message: 'Invalid username' });
        }

          // If user exists, retrieve the first document
          const userDoc = userMatch.docs[0];
          const userData = userDoc.data();


        const passwordMatch = await bcrypt.compare(pass, userData.pass);
        const email = userData.email;


        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }


       return res.status(200).json({
         message: 'User successfully logged in',
         username: req.body.username,
         email: email,
       });

    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});



// ----------------------------------------------------< Save Design System Route >--------------------------------------------------------


app.post('/saveDesignSystem', async (req, res) => {

  const { username, data } = req.body; 
  
  // console.log('is this save design system route working or not ??? ')


    try {
      // Fetch the user's document using their username
      const userRef = await firestore.collection('users').where('username', '==', username).get();

      if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

      if (userRef.empty) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Get the user document reference
      const userDoc = userRef.docs[0].ref;

      // Save the design system in the user's "savedSystems" subcollection
      const sysRef = await userDoc.collection('savedSystems').add({
         ...data,
         createdAt: new Date().toISOString(),
    });

     console.log('New system ID:', sysRef.id)

    return res.status(200).json({
      success: true,
      message: 'Design System successfully stored.',
      systemId: sysRef.id
    })


  } catch (error) {
    console.error('Error saving design system:', error);
    return res.status(500).json({ message: 'Error saving design system. Please try again later.' });
  }


});


// ----------------------------------------------------< Get Profile Picture (Not Active) >--------------------------------------------------------

// this endpoint is not being used atm

app.post('/getPfp', async (req, res) => {

  const { username } = req.body;

  console.log('getPfp called with username:', username);


  try {
    const userRef = await firestore.collection('users').where('username', '==', username).get();

    if(userRef.empty){
      return res.status(500).json({message: 'no user with that username found', success: false});
    }

    const userData = userRef.docs[0].data();
    console.log('Found user data:', userData);

    
    if(userData.profilePicture){
      return res.status(200).json({ 
        success: true,
        message: 'profile picture found and sent back',
        profilePicture: userData.profilePicture 
      });

    }

    if(!userData.profilePicture){
      console.log('no profile picrture was found for that user')
      return res.status(500).json({message: 'no profile picrture was found for that user', success: false })
    }
  

  } catch(err) {
    console.error('Error fetching profile picture:', err);
    return res.status(500).json({ message: 'Error fetching profile picture. Please try again later.', success: false });
  }

});


// ----------------------------------------------------< Save Profile Picture >--------------------------------------------------------

// this endpoint is not being used atm


app.post('/savePfp', async (req, res) => {
  const { username, profilePicture } = req.body;

  console.log('Received username:', username);
  console.log('Received profilePicture:', profilePicture);
  


  try {
    const userRef = await firestore.collection('users').where('username', '==', username).get();

    if (userRef.empty) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const userDoc = userRef.docs[0].ref;
    console.log('Found user data:', userDoc);

    await userDoc.update({ profilePicture });

    return res.status(200).json({ message: 'Profile picture updated successfully', success: true });

  } catch (err) {
    console.error('Error saving profile picture:', err);
    return res.status(500).json({ message: 'Error saving profile picture. Please try again later.', success: false });
  }
});



// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ****  --------------------------------------------------< SAVE FAVORITE INITIALLY >----------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------


app.post('/saveFavorite', async(req, res) =>{

  const { payload, username, type } = req.body;
  // const { screenType} = req.query

  const { data, element, iconType } = payload || {};


    try{
 
     const userRef = await firestore.collection('users').where('username', '==', username).get();
 
     if(!username){
       return res.status(404).json({message: 'uername is required'})
     }
   
 
     if(userRef.empty){
       return res.status(404).json({message: 'no snapshot could be found for that username '})
     }
 
     const userDoc = userRef.docs[0].ref;
 
     let query = userDoc.collection('favorites').where('type', '==', type); // this matches and compares the type in favorites DB of each element with the type thats being passed to the server
 
     let favoriteData = {
       createdAt: new Date().toISOString(),
       type, // Always store the type for easier filtering later
     };
 
     // all these if else statements essentially check for DUPLICATES 
 
     if (type === 'font') {
       query = query.where('name', '==', element.name); // do they matching for each corro type
       favoriteData = {
         ...favoriteData,
         ...element,
       };
     } else if(type === 'color'){
       query = query.where('name', '==', element.name);
       favoriteData = {
         ...favoriteData,
         ...element,
       };
 
     }else if (type === 'icon') {
       query = query.where('iconType', '==', iconType);
       favoriteData = {
         ...favoriteData,
         iconType,
       };
     } else if (type === 'component'){    // this should be 'component' to keep it consistent ?
       query = query.where('package', '==', data.package);
       favoriteData = {
         ...favoriteData,
         ...data, // data should same structure no matter what when going in the favorite. same with typography. we need to make this consistent. 
       };
     }else if (type === 'typography') {
        // need screentypes ? since data might be different 
        query = query.where('name', '==', data[0]?.name);
        favoriteData = {
          ...favoriteData,
          ...data[0],  
        };
 
     }
 
     const existing = await query.get(); //  returns a QuerySnapshot object, 
 
     if (!existing.empty) { // if isnt empty 
       console.log('Already favorited!');
       return res.status(500).json({message: "you already have that element favorited", success: true}); // Stop here — already in favorites
     }
 
 
 
     await userDoc.collection('favorites').add(favoriteData);// creates a collection called favs if it doesnt exist yet.
       
  
     console.log('successfully saved element to your favorites')
     return res.status(200).json({message: 'successfully saved element to your favorites', success: true})
 
 
    }catch(err){
     console.log('Error saving that favorite to DB', err)
      return res.status(500).json({message: 'Error saving favorite element. Please try again later.', success: false})
    }
 })


// --------------------------------------------------------< DELETE FAVORITE >-----------------------------------------------------------

app.delete('/deleteFavorite', async (req, res) => {

  // basically this will be sent a corro element from the "elementScreen" and we will once again look for the match in the favorites DB
  // if a match is found delete that element from the DB 
  // if no match is found that means there is a problem lol 
     
  const { username, type, payload } = req.body;
   const { data, element, iconType } = payload || {};

  console.log('Delete Favorite payload:', req.body);


  try{

    const userRef = await firestore.collection('users').where('username', '==', username).get();
 
    if(!username){
      return res.status(404).json({message: 'uername is required'})
    }
  

    if(userRef.empty){
      return res.status(404).json({message: 'no snapshot could be found for that username '})
    }

    const userDoc = userRef.docs[0].ref;

    let favoritesSnapshot = await userDoc.collection('favorites').where('type', '==', type).get();

    let foundDoc = null;

    for(const doc of favoritesSnapshot.docs){
      let fav = doc.data()


      if (!fav) continue;

 
      const match = 
         (type === 'color' && element.name === fav.name) ||
         (type === 'font' && element.name === fav.name) ||
         (type === 'icon' && iconType === fav.iconType) ||
         (type === 'typography' && data[0].name === fav.name) ||
         (type === 'component' && data.package === fav.package)
 
 
         if (match) {
          foundDoc = doc.ref; //  store document reference
          break;
        }
    }

    if (foundDoc) {
      await foundDoc.delete();
      return res.status(200).json({ message: 'Favorite match found, fav deleted.', success: true });
    } else {
      return res.status(200).json({ message: 'No favorite match found to delete.', success: false });
    }
  
 


  }catch(err){
    console.log('Error trying to delete favorite from DB', err)
    return res.status(500).json({message: 'Error trying to delete favorite from DB', success: false})
  }

})

// ------------------------------------------------------< CHECK FAVORITES >---------------------------------------------------------------

app.post('/checkFavorites', async (req, res) =>{

  const { payload, username } = req.body;
  const { data, type, element, iconType } = payload || {};


// console.log('checkFavs type:', type)
// console.log('checkFavs data:', data)
// console.log('checkFavs element:', element)
//  console.log('checkFavs payload:', payload)
//  console.log('checkFavs username:', username)


try{

    
  const userRef = await firestore.collection('users').where('username', '==', username).get();

  if(!username){
    return res.status(404).json({message: 'uername is required'})
  }


  if(userRef.empty){
    return res.status(404).json({message: 'no snapshot could be found for that username '})
  }

  const userDoc = userRef.docs[0].ref;

 

 // If no payload (meaning no specific item to check), return all favorites of that type
 if (!payload || Object.keys(payload).length === 0) {
      const allFavoritesSnapshot = await userDoc.collection('favorites').get();
      const allFavorites = allFavoritesSnapshot.docs.map(doc => doc.data());
      // console.log('checkFavs all favoritesData:', allFavorites)
      return res.status(200).json({ message: 'Favorites data returned', favData: allFavorites });
}


let favoritesSnapshot = await userDoc.collection('favorites').where('type', '==', type).get();

  let foundMatch = false;


  for(const doc of favoritesSnapshot.docs){
     let fav = doc.data();

     if (!fav) continue;

     if(type === 'typography'){
      console.log('checkFav typo data name:', data[0].name)
      console.log('checkFav typo favorite name:', fav.name)

     }

     const match = 
        (type === 'color' && element.name === fav.name) ||
        (type === 'font' && element.name === fav.name) ||
        (type === 'icon' && iconType === fav.iconType) ||
        (type === 'typography' && data[0].name === fav.name) ||
        (type === 'component' && data.package === fav.package)


     if(match){
      foundMatch = true
     }

  }

  if (foundMatch) {
    return res.status(200).json({ message: 'Favorite match found.', success: true });
  } else {
    return res.status(200).json({ message: 'No favorite match found.', success: false });
  }

}catch(err){
  console.log('Error checking favorites DB', err)
     return res.status(500).json({message: 'Error checking favorites DB', success: false})
}
   

})





// ------------------------------------------------< Update Existing Design Systems >------------------------------------------------------


app.patch('/updateSystem', async (req, res) => {

  const {username, systemId, element, category} = req.body;

  let success = false;

  try{

      if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }
    // snapshot list of all the users with that name (should just be one tho)
    const existingUser = await firestore.collection('users').where('username', '==', username).get();
      
      if(existingUser.empty){
        success = false
        return res.status(400).json({message: 'could not find snapshot of that user', success: success})
      }

      // This grabs the first matching document snapshot (hence first index [0])
      const userDoc = existingUser.docs[0].ref

      const systemDocRef = userDoc.collection('savedSystems').doc(systemId); // reference it 
      const systemDoc = await systemDocRef.get(); // async get it 

      if (!systemDoc.exists) { // .empty is used with snapshots, .exists is used with docs
        success = false
        return res.status(404).json({ message: 'Design system not found.', success: success });
      }

      const systemData = systemDoc.data();
      const incoming = Array.isArray(element) ? element : [element];

      const updatedArray = [...(systemData[category] || []), ...incoming]; // create the new array with the added element 

      await systemDocRef.update({ // update the pre-existing array in the database with the new one 
        [category]: updatedArray
      });

      // then open up the correct category and make a copy of the array with the new element pushed in it
      // then replace the old one with the new one in the database 
      success = true
      res.status(200).json({ message: 'Element added to design system.', success: success});

     
  }catch(err){
    console.error('error saving that element to a corro design system', err)
    success = false
    return res.status(500).json({message: "error occured when trying to update design system", success: success})

  }
   
})


// ---------------------------------------------------< Get Saved Design Systems >---------------------------------------------------------


app.get('/saved', async (req, res) => {
   
     const {username} = req.query;
    //  console.log(username)
    try{
      const userRef = await firestore.collection('users').where('username', '==', username).get(); 

      if (userRef.empty) {
        return res.status(404).json({ message: 'Could not find a user with that username in the database.' });
      }
    
      // Proceed with the user reference
      const userDoc = userRef.docs[0].ref; 

      const savedSystemsSnapshot = await userDoc.collection('savedSystems').get();

      if (savedSystemsSnapshot.empty) {
        console.log('No saved systems found.');
        return [];
      }

      const savedSystems = savedSystemsSnapshot.docs.map(doc => ({
        id: doc.id,         // Include the document ID if needed
        ...doc.data(),      // Spread the document data
      }));

      // console.log('Saved systems:', savedSystems);
      return res.json(savedSystems);




    }catch(err){
      res.status(500).json({message: 'Error retreiving saved design system. Please try again later.'})
    }
   

})

// ----------------------------------------------------------< Delete Element From DS >----------------------------------------------------

app.delete('/deleteElement', async (req, res) => {

    let {type, id, username, index} = req.body;
    // console.log(id)

    try{
      const userRef = await firestore.collection('users').where('username', '==', username).get(); 

      if (userRef.empty) {
        return res.status(404).json({ message: 'Could not find a user with that username in the database.' });
      }


        const userDoc = userRef.docs[0];  // snap shot of what you want to look at
        const systemDocRef = userDoc.ref.collection('savedSystems').doc(id); // filter the to find the corro ID
        const systemDoc = await systemDocRef.get();
    
        const systemData = systemDoc.data(); // returns the data for that first index of savedSystems

        if (!systemData[type]) {
          return res.status(404).json({ message: `The specified type (${type}) does not exist in the system.` }); // if that corro system does not have to corro type
        }

        if (type === 'typography') {
          // Set the typography field to an empty array
          await systemDocRef.update({ typography: [] });
        } else {
    
        // Filter out the element to delete
        let updatedElements = [...systemData[type]];

        // cut that element out of the array 
        updatedElements.splice(index, 1)
    
        // Update the specific Firestore property value with the new filtered/spliced array
          await systemDocRef.update({ [type]: updatedElements });
        }
        return res.status(200).json({ message: 'Element successfully deleted from the system' });


    }catch(err){
      console.error('Error deleting element:', err);
      res.status(500).json({message: 'Error deleting element from corro system. Please try again later.'})
    }

})

// -----------------------------------------------< Delete Saved Design System >------------------------------------------------------------

app.delete('/deleteSystem', async (req, res) =>{
   const {username, id} = req.body;

   try{

    const existingUser = await firestore.collection('users').where('username', '==', username).get();

    if(existingUser.empty){
       return res.status(404).json({message: 'no user with that username was found'});
    }
 
    const userDoc = existingUser.docs[0];
    await userDoc.ref.collection('savedSystems').doc(id).delete(); 
 
    return res.status(200).json({ message: 'Design system successfully deleted' });

   }catch(err){
    console.error('Error deleting design system:', err);
    return res.status(500).json({ message: 'Failed to delete design system' });
   }
  


})
