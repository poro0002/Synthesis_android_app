import 'dotenv/config';

export default {
  expo: {
    name: 'synthesis',
    slug: 'synthesis',
    version: '1.0.0',
    // other stuff...
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};