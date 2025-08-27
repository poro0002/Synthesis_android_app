import 'dotenv/config';
console.log('Environment loaded:', process.env.API_URL); 

export default {
  expo: {
    name: 'synthesis',
    slug: 'synthesis',
    version: '1.1.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    statusBarStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/logo2.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.anonymous.synthesis',
      versionCode: 32,
      permissions: [
        'INTERNET'
      ],
       statusBarStyle: 'light',
       statusBarTranslucent: true,
       statusBarBackgroundColor: 'transparent'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-font'
    ],
    sdkVersion: '53.0.0',
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: 'e25342a7-dbfd-4298-a0bf-fcfe2b3f2d78',
      },
    },
  },
};