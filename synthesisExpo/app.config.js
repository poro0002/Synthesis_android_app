import 'dotenv/config';

export default {
  expo: {
    name: 'synthesis',
    slug: 'synthesis',
    version: '1.0.0',
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: 'e25342a7-dbfd-4298-a0bf-fcfe2b3f2d78',  // add this line
      },
    },
  },
};