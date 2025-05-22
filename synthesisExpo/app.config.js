import 'dotenv/config';

export default {
  expo: {
    name: 'synthesis',
    slug: 'synthesis',
    version: '1.0.0',
   
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};